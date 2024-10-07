import React, { useMemo, useState } from "react";
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
import { PerimeterType } from "types/api-depot";
import PerimeterList from "@/components/api-depot/client/client-form/perimeter-list";
import Button from "@codegouvfr/react-dsfr/Button";
import MoissoneurSourceItem from "@/components/moissonneur-bal/sources/moissonneur-source-item";
import Link from "next/link";
import { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { getPartenaireDeLaCharteByOrganizationDataGouv } from "@/lib/partenaires-de-la-charte";

type OrganizationPageProps = {
  organization: OrganizationMoissoneurType;
  sources: SourceMoissoneurType[];
  partenaires: PartenaireDeLaChartType[];
};

const OrganizationPage = ({
  organization,
  sources,
  partenaires,
}: OrganizationPageProps) => {
  const [perimeters, setPerimeters] = useState<PerimeterType[]>(
    organization?.perimeters ? organization.perimeters : []
  );
  const [partenaire, setpPartenaire] = useState<PartenaireDeLaChartType | null>(
    partenaires.length > 0 ? partenaires[0] : null
  );

  const onUpdatePerimeter = async () => {
    try {
      const res = await updateOrganization(organization._id, { perimeters });
      organization.perimeters = [...perimeters];
      onResetPerimeter();
      toast("Modifications enregistrées", { type: "success" });
    } catch (error: unknown) {
      console.log(error);
      toast("Erreur lors de l’enregistrement des modifications", {
        type: "error",
      });
    }
  };

  const onResetPerimeter = async () => {
    setPerimeters(organization.perimeters);
  };

  const perimeterChange = useMemo(() => {
    return !isEqual(perimeters, organization.perimeters);
  }, [perimeters, organization.perimeters]);

  return (
    <div className="fr-container fr-py-12v">
      <h1>Organization</h1>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <h3>{organization.name}</h3>
          <CopyToClipBoard text={organization._id} title="Id" />
          {partenaire ? (
            <>
              <h3>Partenaire de la charte</h3>
              <Link
                legacyBehavior
                passHref
                href={{
                  pathname: `/partenaires-de-la-charte/${partenaire._id}`,
                }}
              >
                <Button priority="secondary">{partenaire.name}</Button>
              </Link>
            </>
          ) : (
            <Badge severity="warning">Non partenaire</Badge>
          )}

          <div className="fr-py-12v">
            <PerimeterList
              perimeters={perimeters}
              handlePerimeter={setPerimeters}
            />
            <div className="fr-py-6v">
              <Button
                priority="primary"
                onClick={onUpdatePerimeter}
                disabled={!perimeterChange}
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
                  <MoissoneurSourceItem key={source._id} {...source} />
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
