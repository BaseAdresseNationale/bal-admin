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
import { getClients } from "@/lib/api-depot";
import { Client } from "types/api-depot.types";
import { OrganizationMoissoneurType } from "types/moissoneur";
import { getOrganizations } from "@/lib/api-moissonneur-bal";
import { PartenaireDeLaCharteDTO } from "../../server/lib/partenaire-de-la-charte/dto";
import {
  PartenaireDeLaCharte,
  PartenaireDeLaCharteTypeEnum,
  PartenaireDeLaCharteOrganismeTypeEnum,
  PartenaireDeLaCharteServiceEnum,
} from "../../server/lib/partenaire-de-la-charte/entity";

type PartenaireFormProps = {
  title: string | React.ReactNode;
  data?: PartenaireDeLaCharte;
  onSubmit?: (formData: Partial<PartenaireDeLaCharteDTO>) => Promise<void>;
  submitLabel?: string;
  controls?: React.ReactNode;
  isCreation?: boolean;
};

const typeOptions = Object.values(PartenaireDeLaCharteTypeEnum).map(
  (value) => ({ value, label: capitalize(value) })
);

const organismeTypeOptions = Object.values(
  PartenaireDeLaCharteOrganismeTypeEnum
).map((value) => ({ value, label: capitalize(value) }));

const servicesOptions = Object.values(PartenaireDeLaCharteServiceEnum).map(
  (value) => ({ value, label: capitalize(value) })
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
  codeDepartement: [],
  isPerimeterFrance: false,

  contactFirstName: "",
  contactLastName: "",
  contactEmail: "",

  link: "",
  charteURL: "",

  codeRegion: null,
  codeCommune: null,
  testimonyURL: "",
  balURL: "",
  infos: "",
  perimeter: "",
  dataGouvOrganizationId: [],
  apiDepotClientId: [],
};

export const PartenaireForm = ({
  title,
  data,
  onSubmit,
  submitLabel,
  controls,
  isCreation,
}: PartenaireFormProps) => {
  const [formData, setFormData] = useState<PartenaireDeLaCharteDTO>(
    data || newPartenaireForm
  );
  const [optionClients, setOptionClients] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionOrganizations, setOptionOrganizations] = useState<
    { value: string; label: string }[]
  >([]);
  const isCandidate = data && !data.signatureDate;

  useEffect(() => {
    async function fetchOptions() {
      let clients: Client[] = [];
      let organisations: OrganizationMoissoneurType[] = [];

      try {
        organisations = await getOrganizations();
        clients = await getClients(false);
      } catch {}

      setOptionClients(
        clients.map(({ id, nom }) => ({ value: id, label: nom }))
      );
      setOptionOrganizations(
        organisations.map(({ id, name }) => ({ value: id, label: name }))
      );
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
              value={formData.codeDepartement}
              options={departementsOptions}
              onChange={(codeDepartement) => {
                setFormData((state) => ({
                  ...state,
                  codeDepartement,
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
                      checked: formData.isPerimeterFrance,
                      onChange: handleToggle("isPerimeterFrance"),
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
                    formData.signatureDate &&
                    new Date(formData.signatureDate).toISOString().slice(0, 10),
                  onChange: handleEdit("signatureDate"),
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
                value: formData.link,
                onChange: handleEdit("link"),
              }}
            />
          </div>
          {formData.type === PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <>
              <div className="fr-col-6">
                <Input
                  label="Lien vers le témoignage"
                  nativeInputProps={{
                    value: formData.testimonyURL,
                    type: "url",
                    onChange: handleEdit("testimonyURL"),
                  }}
                />
              </div>
              <div className="fr-col-6">
                <Input
                  label="Lien vers la BAL"
                  nativeInputProps={{
                    value: formData.balURL,
                    type: "url",
                    onChange: handleEdit("balURL"),
                  }}
                />
              </div>
            </>
          )}
          {formData.type === PartenaireDeLaCharteTypeEnum.ORGANISME && (
            <div className="fr-col-12">
              <Input
                label="Lien vers le témoignage"
                nativeInputProps={{
                  value: formData.testimonyURL,
                  type: "url",
                  onChange: handleEdit("testimonyURL"),
                }}
              />
            </div>
          )}
          {formData.type !== PartenaireDeLaCharteTypeEnum.COMMUNE && (
            <>
              <div className="fr-col-6">
                <Input
                  label="Périmètre"
                  textArea
                  nativeTextAreaProps={{
                    value: formData.perimeter,
                    onChange: handleEdit("perimeter"),
                  }}
                />
              </div>
              <div className="fr-col-6">
                <Input
                  label="Autres informations"
                  textArea
                  nativeTextAreaProps={{
                    value: formData.infos,
                    onChange: handleEdit("infos"),
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>
      <section>
        <h4>Applications</h4>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <MultiSelectInput
              label="Data.gouv organization ID (Moissonneur)"
              value={formData.dataGouvOrganizationId}
              options={optionOrganizations}
              placeholder="Sélectionnez une ou plusieurs organisations datagouv"
              onChange={(dataGouvOrganizationId) => {
                setFormData((state) => ({
                  ...state,
                  dataGouvOrganizationId,
                }));
              }}
            />
          </div>
          <div className="fr-col-6">
            <MultiSelectInput
              label="Client api depot ID"
              value={formData.apiDepotClientId}
              options={optionClients}
              placeholder="Sélectionnez un ou plusieurs clients de l'api-depot"
              onChange={(apiDepotClientId) => {
                setFormData((state) => ({
                  ...state,
                  apiDepotClientId,
                }));
              }}
            />
          </div>
        </div>
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
