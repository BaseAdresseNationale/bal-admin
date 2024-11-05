import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import Alert from "@codegouvfr/react-dsfr/Alert";
import { getChefsDeFile, getClients, getMandataires } from "@/lib/api-depot";

import ClientItem from "@/components/api-depot/client-item";
import {
  ChefDeFileApiDepotType,
  ClientApiDepotType,
  MandataireApiDepotType,
} from "types/api-depot";
import { getPartenairesDeLaCharte } from "@/lib/partenaires-de-la-charte";
import { PartenaireDeLaCharte } from "../../server/lib/partenaire-de-la-charte/entity";

interface ClientsListProps {
  isDemo: boolean;
}

const ClientsList = ({ isDemo = false }: ClientsListProps) => {
  const [data, setData] = useState<{
    clients: ClientApiDepotType[];
    mandataires: MandataireApiDepotType[];
    chefsDeFile: ChefDeFileApiDepotType[];
    partenaires: PartenaireDeLaCharte[];
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
                key={client._id}
                client={client}
                mandataire={data.mandataires.find(
                  ({ _id }) => _id === client.mandataire
                )}
                chefDeFile={data.chefsDeFile.find(
                  ({ _id }) => _id === client.chefDeFile
                )}
                partenaires={data.partenaires.filter(
                  ({ apiDepotClientId }) =>
                    apiDepotClientId?.includes(client._id)
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
