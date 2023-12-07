/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";

import { BALWidgetConfig } from "../../types/bal-widget";
import { MultiStringInput } from "../multi-string-input";
import { MultiLinkInput } from "../multi-link-input";

type BALWidgetConfigFormProps = {
  config: BALWidgetConfig;
  onSubmit: (data: BALWidgetConfig) => Promise<void>;
};

const StyledForm = styled.form`
  h3,
  h4 {
    margin-bottom: 1rem;
  }

  section {
    margin: 1rem 0;
  }

  .form-controls {
    display: flex;
    align-items: center;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

const defaultConfig: BALWidgetConfig = {
  global: {
    title: "Centre d'aide Base Adresse Locale",
    hideWidget: false,
    showOnPages: [],
  },
  gitbook: {
    welcomeBlockTitle: "Ces articles pourraient vous aider",
    topArticles: [],
  },
  contactUs: {
    welcomeBlockTitle: "Nous contacter",
    subjects: [],
  },
};

export const BALWidgetConfigForm = ({
  onSubmit,
  config: baseConfig,
}: BALWidgetConfigFormProps) => {
  const initialConfig = baseConfig ? { ...baseConfig } : { ...defaultConfig };
  const [formData, setFormData] = useState<BALWidgetConfig>(initialConfig);

  const canPublish = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialConfig);
  }, [formData, initialConfig]);

  const handleEdit =
    (section: keyof BALWidgetConfig, property: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData((state) => ({
        ...state,
        [section]: {
          ...state[section],
          [property]: value,
        },
      }));
    };

  const handleToggle =
    (section: keyof BALWidgetConfig, property: string) => () => {
      setFormData((state) => ({
        ...state,
        [section]: {
          ...state[section],
          [property]: !state[section][property],
        },
      }));
    };

  const resetForm = () => {
    setFormData(initialConfig);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit} className="fr-my-4w">
      <h3>Configuration du widget</h3>
      <section>
        <h4>Globale</h4>
        <Input
          label="Titre du widget"
          nativeInputProps={{
            required: true,
            value: formData.global.title,
            onChange: handleEdit("global", "title"),
          }}
        />
        <Checkbox
          className="perimeter-checkbox"
          options={[
            {
              label: "Cacher le widget",
              nativeInputProps: {
                checked: formData.global.hideWidget,
                onChange: handleToggle("global", "hideWidget"),
              },
            },
          ]}
        />
        <MultiStringInput
          label="Afficher le widget uniquement sur les pages :"
          value={formData.global.showOnPages}
          onChange={(value) =>
            handleEdit("global", "showOnPages")({ target: { value } } as any)
          }
        />
      </section>
      <section>
        <h4>Gitbook</h4>
        <Input
          label="Titre sur la page d'accueil"
          nativeInputProps={{
            required: true,
            value: formData.gitbook.welcomeBlockTitle,
            onChange: handleEdit("gitbook", "welcomeBlockTitle"),
          }}
        />
        <MultiLinkInput
          label="Articles populaires :"
          value={formData.gitbook.topArticles}
          onChange={(value) =>
            handleEdit("gitbook", "topArticles")({ target: { value } } as any)
          }
        />
      </section>
      <section>
        <h4>Formulaire de contact</h4>
        <Input
          label="Titre sur la page d'accueil"
          nativeInputProps={{
            required: true,
            value: formData.contactUs.welcomeBlockTitle,
            onChange: handleEdit("contactUs", "welcomeBlockTitle"),
          }}
        />
        <MultiStringInput
          label="Sujets du formulaire de contact :"
          value={formData.contactUs.subjects}
          onChange={(value) =>
            handleEdit("contactUs", "subjects")({ target: { value } } as any)
          }
        />
      </section>
      <div className="form-controls">
        <Button disabled={!canPublish} type="submit" iconId="fr-icon-save-line">
          Publier
        </Button>
        <Button disabled={!canPublish} type="button" onClick={resetForm}>
          Annuler
        </Button>
      </div>
    </StyledForm>
  );
};
