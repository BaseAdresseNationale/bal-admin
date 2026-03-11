import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import departements from "@etalab/decoupage-administratif/data/departements.json";
import { ImageInput } from "../image-input";
import { MultiSelectInput } from "../multi-select-input";
import type { CommuneType } from "../commune-input";
import { CommuneInput } from "../commune-input";
import SelectInput from "@/components/select-input";
import { capitalize } from "@/lib/util/string";
import { getClients } from "@/lib/api-bal-admin";
import { Client as PartenaireClientDB } from "../../server/lib/partenaire-de-la-charte/clients/entity";
import { PartenaireDeLaCharteDTO } from "../../server/lib/partenaire-de-la-charte/dto";
import {
  PartenaireDeLaCharte,
  PartenaireDeLaCharteTypeEnum,
  PartenaireDeLaCharteOrganismeTypeEnum,
  PartenaireDeLaCharteServiceEnum,
} from "../../server/lib/partenaire-de-la-charte/entity";
import { ClientList } from "./clients/client-list";

type PartenaireFormProps = {
  title: string | React.ReactNode;
  data?: PartenaireDeLaCharte;
  onSubmit?: (formData: Partial<PartenaireDeLaCharteDTO>) => Promise<void>;
  submitLabel?: string;
  controls?: React.ReactNode;
  isCreation?: boolean;
};

const typeOptions = Object.values(PartenaireDeLaCharteTypeEnum).map(
  (value) => ({ value, label: capitalize(value) }),
);

const organismeTypeOptions = Object.values(
  PartenaireDeLaCharteOrganismeTypeEnum,
).map((value) => ({ value, label: capitalize(value) }));

const servicesOptions = Object.values(PartenaireDeLaCharteServiceEnum).map(
  (value) => ({ value, label: capitalize(value) }),
);

const departementsOptions = departements.map((departement) => ({
  value: departement.code,
  label: `${departement.code} - ${departement.nom}`,
}));

const StyledForm = styled.form`
  h3,
  h4 {
    margin-bottom: 1rem;
  }

  section {
    margin: 1rem 0;

    .perimeter-checkbox {
      margin-top: 1rem;
    }
  }

  .form-controls {
    display: flex;
    align-items: center;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

const newPartenaireForm = {
  type: PartenaireDeLaCharteTypeEnum.COMMUNE,
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum.EPCI,
  name: "",
  picture: "",
  services: [],
  coverDepartement: [],
  entrepriseIsPerimeterFrance: false,

  contactFirstName: "",
  contactLastName: "",
  contactEmail: "",

  webSiteURL: "",
  charteURL: "",

  communeCodeInsee: null,
  communeBalURL: "",

  organismeInfo: "",

  clients: [],
};

export const PartenaireForm = ({
  title,
  data,
  onSubmit,
  submitLabel,
  controls,
  isCreation,
}: PartenaireFormProps) => {
  console.log(data);
  const [formData, setFormData] = useState<PartenaireDeLaCharteDTO>(
    data || newPartenaireForm,
  );
  const [allClients, setAllClients] = useState<PartenaireClientDB[]>([]);
  const isCandidate = data && !data.charteSignatureDate;

  useEffect(() => {
    async function fetchOptions() {
      try {
        setAllClients(await getClients());
      } catch {}
    }

    fetchOptions();
  }, []);

  const handleEdit =
    (property: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData((state) => ({ ...state, [property]: value }));
    };

  const handleSelectCommune = (commune: CommuneType) => {
    if (commune) {
      setFormData((state) => ({
        ...state,
        name: commune.nom,
        codeCommune: commune.code,
        codeRegion: commune.region,
      }));
    } else {
      setFormData((state) => ({
        ...state,
        name: "",
        codeCommune: null,
        codeRegion: null,
      }));
    }
  };

  const handleToggle = (property: string) => () => {
    setFormData((state) => ({ ...state, [property]: !state[property] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit} className="fr-my-4w">
      {title}
      <section>
        <h4>Informations de base</h4>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-2">
            <SelectInput
              label="Type*"
              value={formData.type}
              isDisabled={!isCreation}
              options={typeOptions}
              handleChange={(type) => {
                setFormData((state) => ({
                  ...state,
                  type: type as PartenaireDeLaCharteTypeEnum,
                }));
              }}
            />
          </div>
          {formData.type === PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <div className="fr-col-4">
              {isCreation ? (
                <CommuneInput label="Nom*" onChange={handleSelectCommune} />
              ) : (
                <Input
                  label="Nom*"
                  disabled
                  nativeInputProps={{
                    required: true,
                    value: formData.name,
                    onChange: handleEdit("name"),
                  }}
                />
              )}
            </div>
          )}
          {formData.type === PartenaireDeLaCharteTypeEnum.ORGANISME && (
            <>
              <div className="fr-col-2">
                <SelectInput
                  label="Type d'organisme*"
                  value={formData.organismeType}
                  options={organismeTypeOptions}
                  handleChange={(organismeType) => {
                    setFormData((state) => ({
                      ...state,
                      organismeType:
                        organismeType as PartenaireDeLaCharteOrganismeTypeEnum,
                    }));
                  }}
                />
              </div>
              <div className="fr-col-2">
                <Input
                  label="Nom*"
                  nativeInputProps={{
                    required: true,
                    value: formData.name,
                    onChange: handleEdit("name"),
                  }}
                />
              </div>
            </>
          )}
          {formData.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && (
            <div className="fr-col-4">
              <Input
                label="Nom*"
                nativeInputProps={{
                  required: true,
                  value: formData.name,
                  onChange: handleEdit("name"),
                }}
              />
            </div>
          )}
          <div className="fr-col-6">
            <ImageInput
              label="Logo*"
              value={formData.picture}
              onClear={() => {
                setFormData((state) => ({ ...state, picture: undefined }));
              }}
              onChange={(base64Image) => {
                setFormData((state) => ({ ...state, picture: base64Image }));
              }}
            />
          </div>
          <div className="fr-col-6">
            <MultiSelectInput
              label="Services"
              value={formData.services}
              options={servicesOptions}
              placeholder="Sélectionnez un ou plusieurs services"
              onChange={(services) => {
                setFormData((state) => ({
                  ...state,
                  services,
                }));
              }}
            />
          </div>
          <div className="fr-col-6">
            <MultiSelectInput
              label="Couverture géographique"
              placeholder="Sélectionnez un ou plusieurs départements"
              value={formData.coverDepartement}
              options={departementsOptions}
              onChange={(coverDepartement) => {
                setFormData((state) => ({
                  ...state,
                  coverDepartement,
                }));
              }}
            />
            {formData.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE && (
              <Checkbox
                className="perimeter-checkbox"
                options={[
                  {
                    label: "Périmètre France entière",
                    nativeInputProps: {
                      checked: formData.entrepriseIsPerimeterFrance,
                      onChange: handleToggle("entrepriseIsPerimeterFrance"),
                    },
                  },
                ]}
              />
            )}
          </div>
          {!isCreation && !isCandidate && (
            <div className="fr-col-6">
              <Input
                label="Date de signature*"
                nativeInputProps={{
                  required: true,
                  type: "date",
                  value:
                    formData.charteSignatureDate &&
                    new Date(formData.charteSignatureDate)
                      .toISOString()
                      .slice(0, 10),
                  onChange: handleEdit("charteSignatureDate"),
                }}
              />
            </div>
          )}
        </div>
      </section>
      <section>
        <h4>Informations contact</h4>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-4">
            <Input
              label="Nom*"
              nativeInputProps={{
                required: true,
                value: formData.contactLastName,
                onChange: handleEdit("contactLastName"),
              }}
            />
          </div>
          <div className="fr-col-4">
            <Input
              label="Prénom*"
              nativeInputProps={{
                required: true,
                value: formData.contactFirstName,
                onChange: handleEdit("contactFirstName"),
              }}
            />
          </div>
          <div className="fr-col-4">
            <Input
              label="Email*"
              nativeInputProps={{
                required: true,
                type: "email",
                value: formData.contactEmail,
                onChange: handleEdit("contactEmail"),
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <h4>Autres informations</h4>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <Input
              label="Lien vers la charte"
              nativeInputProps={{
                value: formData.charteURL,
                type: "url",
                onChange: handleEdit("charteURL"),
              }}
            />
          </div>
          <div className="fr-col-6">
            <Input
              label="Lien vers le site"
              nativeInputProps={{
                type: "url",
                value: formData.webSiteURL,
                onChange: handleEdit("webSiteURL"),
              }}
            />
          </div>
          {formData.type === PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <>
              <div className="fr-col-6">
                <Input
                  label="Lien vers la BAL"
                  nativeInputProps={{
                    value: formData.communeBalURL,
                    type: "url",
                    onChange: handleEdit("communeBalURL"),
                  }}
                />
              </div>
            </>
          )}
          {formData.type !== PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <div className="fr-col-12">
              <Input
                label="Autres informations"
                textArea
                nativeTextAreaProps={{
                  value: formData.organismeInfo,
                  onChange: handleEdit("organismeInfo"),
                }}
              />
            </div>
          )}
        </div>
      </section>

      <section>
        <h4>Clients</h4>
        <ClientList
          clients={formData.clients || []}
          allClients={allClients}
          onChange={(clients) =>
            setFormData((state) => ({ ...state, clients }))
          }
        />
      </section>
      <div className="form-controls">
        <Button type="submit" iconId="fr-icon-save-line">
          {submitLabel || "Enregistrer"}
        </Button>
        {controls}
      </div>
    </StyledForm>
  );
};
