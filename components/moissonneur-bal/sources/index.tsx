import MoissoneurSourceItem from "@/components/moissonneur-bal/sources/moissonneur-source-item";
import { ExtendedSourceMoissoneurType } from "types/moissoneur";
import { useState } from "react";

type MoissoneurSourcesProps = {
  sources: ExtendedSourceMoissoneurType[];
};

const MoissoneurSources = ({ sources }: MoissoneurSourcesProps) => {
  const getFilteredSource = (
    showDeleted: boolean
  ): ExtendedSourceMoissoneurType[] => {
    const resSources = sources.sort(({ harvestError, nbRevisionError }) =>
      harvestError || nbRevisionError > 0 ? -1 : 1
    );

    if (showDeleted) {
      return resSources;
    }
    return resSources.filter((s) => !s._deleted);
  };

  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [sourcesFiltered, setSourcesFiltered] = useState<
    ExtendedSourceMoissoneurType[]
  >(getFilteredSource(showDeleted));

  const toggleShowDelete = () => {
    const isShowDeleted = !showDeleted;
    setShowDeleted(isShowDeleted);
    setSourcesFiltered(getFilteredSource(isShowDeleted));
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
              <th scope="col">Id</th>
              <th scope="col">Title</th>
              <th scope="col">Actif</th>
              <th scope="col">Date de mise à jour</th>
              <th scope="col">Erreur Moissonnage</th>
              <th scope="col">Erreur Revisions</th>
              <th scope="col" />
            </tr>
          </thead>

          <tbody>
            {sourcesFiltered.map((source) => (
              <MoissoneurSourceItem key={source._id} {...source} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoissoneurSources;
