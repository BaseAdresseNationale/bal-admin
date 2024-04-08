import {
  OrganizationBalAdminType,
  OrganizationMoissoneurType,
} from "types/moissoneur";
import { useState } from "react";
import MoissoneurOrganizationItem from "./moissonneur-organization-item";
import { PartenaireDeLaChartType } from "types/partenaire-de-la-charte";

type MoissoneurOrganizationsProps = {
  organizations: OrganizationMoissoneurType[];
  partenaires: PartenaireDeLaChartType[];
};

const MoissoneurOrganizations = ({
  organizations,
  partenaires,
}: MoissoneurOrganizationsProps) => {
  const getFilteredOrganizations = (
    showDeleted: boolean
  ): OrganizationBalAdminType[] => {
    let res = organizations.sort((a, b) =>
      a.perimeters && b.perimeters.length ? -1 : 1
    );

    if (!showDeleted) {
      res = res.filter((s) => !s._deleted);
    }

    return res.map((orga) => {
      const partenaire: PartenaireDeLaChartType | null =
        partenaires.find(
          ({ dataGouvOrganizationId }) => dataGouvOrganizationId === orga._id
        ) || null;
      return { ...orga, partenaire };
    });
  };

  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [organizationsFiltered, setOrganizationsFiltered] = useState<
    OrganizationBalAdminType[]
  >(getFilteredOrganizations(showDeleted));

  const toggleShowDelete = () => {
    const isShowDeleted = !showDeleted;
    setShowDeleted(isShowDeleted);
    setOrganizationsFiltered(getFilteredOrganizations(isShowDeleted));
  };

  return (
    <div className="fr-container fr-py-12v">
      <div className="fr-toggle">
        <input
          type="checkbox"
          className="fr-toggle__input"
          aria-describedby="toggle-source-hint-text"
          id="toggle-source"
          checked={showDeleted}
          onChange={toggleShowDelete}
        />
        <label className="fr-toggle__label" htmlFor="toggle-source">
          Voir supprimé
        </label>
      </div>
      <div className="fr-table">
        <table>
          <caption>Liste des sources moissonnées</caption>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Page</th>
              <th scope="col">Actif</th>
              <th scope="col">Partenaire</th>
              <th scope="col">Date de mise à jour</th>
              <th scope="col" />
            </tr>
          </thead>

          <tbody>
            {organizationsFiltered.map((organization) => (
              <MoissoneurOrganizationItem
                key={organization._id}
                {...organization}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoissoneurOrganizations;
