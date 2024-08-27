import React, { useState, useMemo, useEffect, useRef } from "react";
import Tabs from "@codegouvfr/react-dsfr/Tabs";
import styled from "styled-components";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";

import { BALWidgetConfig } from "../../types/bal-widget";
import { MultiStringInput } from "../multi-string-input";
import { MultiLinkInput } from "../multi-link-input";
import { MultiSelectInput } from "../multi-select-input";
import { ClientApiDepotType } from "types/api-depot";
import { SourceMoissoneurType } from "types/moissoneur";
import { getClients } from "@/lib/api-depot";
import { getSources } from "@/lib/api-moissonneur-bal";

type BALWidgetConfigFormProps = {
  baseConfig: BALWidgetConfig;
  formData: BALWidgetConfig;
  setFormData: React.Dispatch<React.SetStateAction<BALWidgetConfig>>;
  onSubmit: (data: BALWidgetConfig) => Promise<void>;
};

const StyledForm = styled.form`
  h3,
  h4 {
    margin-bottom: 1rem;
  }

  section {
    margin: 1.5rem 0;
  }

  .form-controls {
    margin-top: 2rem;
    display: flex;
    align-items: center;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const BALWidgetConfigForm = ({
  onSubmit,
  baseConfig,
  formData,
  setFormData,
}: BALWidgetConfigFormProps) => {
  const tabRef = useRef(null);
  const [selectedTabId, setSelectedTabId] = useState("communes");
  const [apiDepotClients, setApiDepotClients] = useState<ClientApiDepotType[]>(
    []
  );
  const [harvestSources, setHarvestSources] = useState<SourceMoissoneurType[]>(
    []
  );

  const canPublish = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(baseConfig);
  }, [formData, baseConfig]);

  useEffect(() => {
    async function fetchData() {
      try {
        const clients = await getClients();
        setApiDepotClients(clients);
      } catch (error) {
        console.log(error);
      }
      try {
        const sources = await getSources();
        setHarvestSources(sources);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // Add type="button" to all tabs buttons to avoid form submission
  useEffect(() => {
    if (tabRef.current) {
      const tabBtns = tabRef.current.querySelectorAll(".fr-tabs__tab");
      tabBtns.forEach((btn) => {
        btn.setAttribute("type", "button");
      });
    }
  }, [tabRef]);

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
    setFormData(baseConfig);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit} className="fr-my-4w">
      <h3>Configuration de BAL Widget</h3>
      <section>
        <h4>Globale</h4>
        <Input
          label="Titre du widget"
          nativeInputProps={{
            required: true,
            value: formData.global?.title || "",
            onChange: handleEdit("global", "title"),
          }}
        />
        <Checkbox
          className="perimeter-checkbox"
          options={[
            {
              label: "Cacher le widget",
              nativeInputProps: {
                checked: formData.global?.hideWidget || false,
                onChange: handleToggle("global", "hideWidget"),
              },
            },
          ]}
        />
        <MultiStringInput
          label="Afficher le widget uniquement sur les pages :"
          value={formData.global?.showOnPages || []}
          onChange={(value) =>
            handleEdit("global", "showOnPages")({ target: { value } } as any)
          }
          placeholder="Path de la page autorisée (/programme-bal)"
        />
      </section>
      <Tabs
        ref={tabRef}
        selectedTabId={selectedTabId}
        onTabChange={(e) => setSelectedTabId(e)}
        tabs={[
          { tabId: "communes", label: "Communes" },
          { tabId: "particuliers", label: "Particuliers" },
        ]}
      >
        {selectedTabId === "communes" && (
          <>
            <section>
              <h4>Aide aux communes</h4>
              <Input
                label="Titre sur la page d'accueil"
                nativeInputProps={{
                  required: true,
                  value: formData.communes?.welcomeBlockTitle || "",
                  onChange: handleEdit("communes", "welcomeBlockTitle"),
                }}
              />
              <MultiSelectInput
                label="Clients API Dépôt caducs"
                value={formData.communes?.outdatedApiDepotClients || []}
                options={apiDepotClients.map((client) => ({
                  value: client._id,
                  label: client.nom,
                }))}
                placeholder="Sélectionner les clients API Dépôt caducs"
                onChange={(value) =>
                  setFormData((state) => ({
                    ...state,
                    communes: {
                      ...state.communes,
                      outdatedApiDepotClients: value,
                    },
                  }))
                }
              />
              <MultiSelectInput
                label="Sources moissonnées caduques"
                value={formData.communes?.outdatedHarvestSources || []}
                options={harvestSources.map((source) => ({
                  value: source.id,
                  label: source.title,
                }))}
                placeholder="Sélectionner les sources moissonnées caduques"
                onChange={(value) =>
                  setFormData((state) => ({
                    ...state,
                    communes: {
                      ...state.communes,
                      outdatedHarvestSources: value,
                    },
                  }))
                }
              />
            </section>
            <section>
              <h4>Gitbook pour les communes</h4>
              <Input
                label="Titre sur la page d'accueil"
                nativeInputProps={{
                  required: true,
                  value: formData.gitbookCommunes?.welcomeBlockTitle || "",
                  onChange: handleEdit("gitbookCommunes", "welcomeBlockTitle"),
                }}
              />
              <MultiLinkInput
                label="Articles populaires :"
                placeholders={[
                  "Comment puis-je obtenir une adresse ?",
                  "Path Gitbook de l'article (/utiliser-la-ban/mon-article)",
                ]}
                value={formData.gitbookCommunes?.topArticles || []}
                onChange={(value) =>
                  handleEdit(
                    "gitbookCommunes",
                    "topArticles"
                  )({ target: { value } } as any)
                }
              />
            </section>
            <section>
              <h4>Formulaire de contact</h4>
              <Input
                label="Titre sur la page d'accueil"
                nativeInputProps={{
                  required: true,
                  value: formData.contactUs?.welcomeBlockTitle || "",
                  onChange: handleEdit("contactUs", "welcomeBlockTitle"),
                }}
              />
              <MultiStringInput
                label="Sujets du formulaire de contact :"
                placeholder="Je souhaite publier une BAL"
                value={formData.contactUs?.subjects || []}
                onChange={(value) =>
                  handleEdit(
                    "contactUs",
                    "subjects"
                  )({ target: { value } } as any)
                }
              />
            </section>
          </>
        )}
        {selectedTabId === "particuliers" && (
          <>
            <section>
              <h4>Gitbook pour les particuliers</h4>
              <Input
                label="Titre sur la page d'accueil"
                nativeInputProps={{
                  required: true,
                  value: formData.gitbookParticuliers?.welcomeBlockTitle || "",
                  onChange: handleEdit(
                    "gitbookParticuliers",
                    "welcomeBlockTitle"
                  ),
                }}
              />
              <MultiLinkInput
                label="Articles populaires :"
                placeholders={[
                  "Comment puis-je obtenir une adresse ?",
                  "Path Gitbook de l'article (/utiliser-la-ban/mon-article)",
                ]}
                value={formData.gitbookParticuliers?.topArticles || []}
                onChange={(value) =>
                  handleEdit(
                    "gitbookParticuliers",
                    "topArticles"
                  )({ target: { value } } as any)
                }
              />
            </section>
          </>
        )}
      </Tabs>

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
