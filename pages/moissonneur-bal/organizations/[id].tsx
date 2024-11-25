import { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { toast } from "react-toastify";

import {
  OrganizationMoissoneurType,
  SourceMoissoneurType,
} from "types/moissoneur";
import {
  getOrganization,
  getSourcesOrganization,
  updateOrganization,
} from "@/lib/api-moissonneur-bal";
import CopyToClipBoard from "@/components/copy-to-clipboard";
import PerimeterList from "@/components/api-depot/client/client-form/perimeter-list";
import Button from "@codegouvfr/react-dsfr/Button";
import MoissoneurSourceItem from "@/components/moissonneur-bal/sources/moissonneur-source-item";
import Link from "next/link";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { getPartenaireDeLaCharteByOrganizationDataGouv } from "@/lib/partenaires-de-la-charte";
import { PartenaireDeLaCharte } from "../../../server/lib/partenaire-de-la-charte/entity";
import TextInput from "@/components/text-input";

type OrganizationPageProps = {
  organization: OrganizationMoissoneurType;
  sources: SourceMoissoneurType[];
  partenaires: PartenaireDeLaCharte[];
};

const OrganizationPage = ({
  organization,
  sources,
  partenaires,
}: OrganizationPageProps) => {
  const [formData, setFormData] = useState<Partial<OrganizationMoissoneurType>>(
    {
      perimeters: organization.perimeters || [],
      email: organization.email,
    }
  );

  const partenaire: PartenaireDeLaCharte | null = useMemo(() => {
    return partenaires.length > 0 ? partenaires[0] : null;
  }, [partenaires]);

  const onUpdate = async () => {
    try {
      const res = await updateOrganization(organization.id, formData);
      organization.perimeters = res.perimeters;
      organization.email = res.email;
      onResetPerimeter();
      toast("Modifications enregistrées", { type: "success" });
    } catch (error: unknown) {
      console.error(error);
      toast("Erreur lors de l’enregistrement des modifications", {
        type: "error",
      });
    }
  };

  const handleEdit = useCallback(
    (property: string) => (value: any) => {
      setFormData((state) => ({ ...state, [property]: value }));
    },
    []
  );

  const onResetPerimeter = async () => {
    handleEdit("perimeters")(organization.perimeters);
  };

  const perimeterChange = useMemo(() => {
    return !isEqual(formData.perimeters, organization.perimeters);
  }, [formData.perimeters, organization.perimeters]);

  const emailChange = useMemo(() => {
    return !isEqual(formData.email, organization.email);
  }, [formData.email, organization.email]);

  return (
    <div className="fr-container fr-py-12v">
      <h1>Organization</h1>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <h3>{organization.name}</h3>
          <CopyToClipBoard text={organization.id} title="Id" />
          {partenaire ? (
            <>
              <h3>Partenaire de la charte</h3>
              <Link
                legacyBehavior
                passHref
                href={{
                  pathname: `/partenaires-de-la-charte/${partenaire.id}`,
                }}
              >
                <Button priority="secondary">{partenaire.name}</Button>
              </Link>
            </>
          ) : (
            <Badge severity="warning">Non partenaire</Badge>
          )}

          <div className="fr-py-12v">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-6">
                <TextInput
                  label="Email"
                  value={formData.email}
                  hint="Email de l'organization"
                  onChange={(e) => {
                    handleEdit("email")(e.target.value);
                  }}
                />
              </div>
            </div>
            <PerimeterList
              perimeters={formData.perimeters}
              handlePerimeter={handleEdit("perimeters")}
            />
            <div className="fr-py-6v">
              <Button
                priority="primary"
                onClick={onUpdate}
                disabled={!perimeterChange && !emailChange}
              >
                Enregistrer
              </Button>
              <Button
                priority="secondary"
                onClick={(e) => onResetPerimeter()}
                disabled={!perimeterChange}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="fr-table fr-py-12v">
            <table>
              <caption>Liste des sources</caption>
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date de mise à jour</th>
                  <th scope="col">Erreur Moissonnage</th>
                  <th scope="col">Erreur Revisions</th>
                  <th scope="col" />
                </tr>
              </thead>

              <tbody>
                {sources.map((source) => (
                  <MoissoneurSourceItem key={source.id} {...source} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { id } = params;
  const organization: OrganizationMoissoneurType = await getOrganization(id);
  const sources: SourceMoissoneurType[] = await getSourcesOrganization(id);

  const partenaires = await getPartenaireDeLaCharteByOrganizationDataGouv(
    String(id)
  );

  return {
    props: { organization, sources, partenaires },
  };
}
export default OrganizationPage;
