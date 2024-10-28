import { useEffect, useState } from "react";

import Alert from "@codegouvfr/react-dsfr/Alert";
import { getChefsDeFile, getClients, getMandataires } from "@/lib/api-depot";

import ClientItem from "@/components/api-depot/client-item";
import { ChefDeFile, Client, Mandataire } from "types/api-depot.types";
import { getPartenairesDeLaCharte } from "@/lib/partenaires-de-la-charte";
import { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";

interface ClientsListProps {
  isDemo: boolean;
}

const ClientsList = ({ isDemo = false }: ClientsListProps) => {
  const [data, setData] = useState<{
    clients: Client[];
    mandataires: Mandataire[];
    chefsDeFile: ChefDeFile[];
    partenaires: PartenaireDeLaChartType[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clients, mandataires, chefsDeFile, partenaires] =
          await Promise.all([
            getClients(isDemo),
            getMandataires(isDemo),
            getChefsDeFile(isDemo),
            getPartenairesDeLaCharte(),
          ]);

        setData({ clients, mandataires, chefsDeFile, partenaires });
      } catch (error) {
        setError(`Impossible de charger les données : ${error.message}`);
      }
    }

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <Alert
        className="fr-my-2w"
        title="Erreur"
        description={error}
        severity="error"
        closable={false}
        small
      />
    );
  }

  return (
    <div className="fr-table">
      {data ? (
        <table>
          <caption>
            Liste des clients de l’API dépôt{" "}
            {isDemo ? " - [DÉMONSTRATION]" : ""}
          </caption>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Mandataire</th>
              <th scope="col">Chef de file</th>
              <th scope="col">Stratégie d’autorisation</th>
              <th scope="col">Activé</th>
              <th scope="col">Mode relax</th>
              <th scope="col">Partenaire</th>
              <th scope="col">Editer</th>
              <th scope="col">Consulter</th>
            </tr>
          </thead>

          <tbody>
            {data?.clients.map((client) => (
              <ClientItem
                key={client.id}
                client={client}
                mandataire={data.mandataires.find(
                  ({ id }) => id === client.mandataireId
                )}
                chefDeFile={data.chefsDeFile.find(
                  ({ id }) => id === client.chefDeFileId
                )}
                partenaires={data.partenaires.filter(
                  ({ apiDepotClientId }) =>
                    apiDepotClientId?.includes(client.id)
                )}
                isDemo={isDemo}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Chargement…</div>
      )}
    </div>
  );
};

export default ClientsList;
