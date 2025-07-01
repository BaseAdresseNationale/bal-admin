import Link from "next/link";
import { useState } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import Tabs from "@codegouvfr/react-dsfr/Tabs";

import ClientsList from "@/components/api-depot/clients-list";
import { useRouter } from "next/router";

enum TabIdEnum {
  API_DEPOT = "api-depot",
  API_DEPOT_DEMO = "api-depot-demo",
}

const APIDepot = () => {
  const router = useRouter();
  const [selectedTabId, setSelectedTabId] = useState<string>(
    router.query?.demo === "1" ? TabIdEnum.API_DEPOT_DEMO : TabIdEnum.API_DEPOT
  );

  return (
    <div className="fr-container">
      <Tabs
        className="fr-container fr-my-2w"
        selectedTabId={selectedTabId}
        onTabChange={(e) => setSelectedTabId(e)}
        tabs={[
          {
            tabId: TabIdEnum.API_DEPOT,
            label: "Production",
            iconId: "fr-icon-plant-fill",
          },
          {
            tabId: TabIdEnum.API_DEPOT_DEMO,
            label: "Démonstration",
            iconId: "fr-icon-seedling-fill",
          },
        ]}
      >
        <div className="fr-container fr-py-12v">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
            <div className="fr-col-2">
              <Link
                legacyBehavior
                passHref
                href={{
                  pathname: "/api-depot/client/client-form",
                  query: { demo: selectedTabId === TabIdEnum.API_DEPOT_DEMO ? "1" : "0" },
                }}
              >
                <Button iconId="fr-icon-add-line">Ajouter un client</Button>
              </Link>
            </div>
          </div>

          <ClientsList isDemo={selectedTabId === TabIdEnum.API_DEPOT_DEMO} />
        </div>
      </Tabs>
    </div>
  );
};

export default APIDepot;
