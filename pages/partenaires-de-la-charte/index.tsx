import React from "react";
import Link from "next/link";

import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

import { EditableList } from "../../components/editable-list";
import { getPartenairesDeLaCharte } from "../../lib/partenaires-de-la-charte";
import { PartenaireItem } from "@/components/partenaires-de-la-charte/partenaire-item";
import { PartenaireDeLaCharte } from "../../server/lib/partenaire-de-la-charte/entity";

type PartenairesDeLaChartePageProps = {
  partenaires: PartenaireDeLaCharte[];
  candidates: PartenaireDeLaCharte[];
  tab?: string;
};

const PartenairesDeLaChartePage = ({
  partenaires,
  candidates,
  tab,
}: PartenairesDeLaChartePageProps) => {
  console.log(partenaires);
  return (
    <div className="fr-container">
      <Tabs
        className="fr-container fr-my-2w"
        tabs={[
          {
            label: "Partenaires de la charte",
            content: (
              <EditableList
                headers={[
                  "Type",
                  "Nom",
                  "Date de signature",
                  "Services",
                  "Applications",
                  "",
                ]}
                caption="Liste des partenaires de la charte"
                data={partenaires}
                filter={{
                  placeholder: "Filtrer par nom",
                  property: "name",
                }}
                createBtn={
                  <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
                    <div className="fr-col-2">
                      <Link
                        passHref
                        href={{
                          pathname: "/partenaires-de-la-charte/new",
                        }}
                      >
                        <Button iconId="fr-icon-add-line">
                          Ajouter un partenaire
                        </Button>
                      </Link>
                    </div>
                  </div>
                }
                renderItem={PartenaireItem}
              />
            ),
          },
          {
            isDefault: tab === "candidatures",
            label: (
              <>
                <Badge style={{ marginRight: 10 }} noIcon>
                  {candidates.length}
                </Badge>{" "}
                {`candidature${candidates.length > 1 ? "s" : ""} en attente`}
              </>
            ),
            content:
              candidates.length === 0 ? (
                "Aucune candidature en attente"
              ) : (
                <EditableList
                  headers={[
                    "Type",
                    "Nom",
                    "Date de candidature",
                    "Services",
                    "Applications",
                    "",
                  ]}
                  caption="Liste des candidatures en attente"
                  data={candidates}
                  renderItem={PartenaireItem}
                />
              ),
          },
        ]}
      />
    </div>
  );
};

export async function getServerSideProps({ query, ...context }) {
  const cookies = context.req.headers.cookie;
  const { tab } = query;
  console.log("Aaaa");
  const allPartenairesDeLaCharte = await getPartenairesDeLaCharte({
    cookie: cookies,
  });
  console.log("Bbbbb");
  const partenaires = allPartenairesDeLaCharte.filter((partenaireDeLaCharte) =>
    Boolean(partenaireDeLaCharte.charteSignatureDate),
  );
  const candidates = allPartenairesDeLaCharte.filter(
    (partenaireDeLaCharte) => !partenaireDeLaCharte.charteSignatureDate,
  );

  return {
    props: {
      partenaires,
      candidates,
      tab: tab || "",
    },
  };
}

export default PartenairesDeLaChartePage;
