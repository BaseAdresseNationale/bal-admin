import MoissoneurSourceItem from "@/components/moissonneur-bal/sources/moissonneur-source-item";
import { ExtendedSourceMoissoneurType } from "types/moissoneur";
import { useMemo, useState } from "react";

type MoissoneurSourcesProps = {
  sources: ExtendedSourceMoissoneurType[];
};

const MoissoneurSources = ({ sources }: MoissoneurSourcesProps) => {
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [showDisabled, setShowDisabled] = useState<boolean>(false);

  const sourcesFiltered = useMemo(() => {
    const resSources = sources.sort(({ harvestError, nbRevisionError }) =>
      harvestError || nbRevisionError > 0 ? -1 : 1
    );
    console.log(showDeleted, showDisabled);
    return resSources
      .filter(({ _deleted }) => (showDeleted ? true : !_deleted))
      .filter(({ enabled }) => (showDisabled ? true : enabled));
  }, [showDeleted, showDisabled, sources]);

  return (
    <div className="fr-container fr-py-12v">
      <div className="fr-toggle">
        <input
          type="checkbox"
          className="fr-toggle__input"
          aria-describedby="toggle-source-hint-text"
          id="toggle-deleted"
          checked={showDeleted}
          onChange={() => setShowDeleted(!showDeleted)}
        />
        <label className="fr-toggle__label" htmlFor="toggle-deleted">
          Voir supprimé
        </label>
      </div>
      <div className="fr-toggle">
        <input
          type="checkbox"
          className="fr-toggle__input"
          aria-describedby="toggle-source-hint-text"
          id="toggle-enable"
          checked={showDisabled}
          onChange={() => setShowDisabled(!showDisabled)}
        />
        <label className="fr-toggle__label" htmlFor="toggle-enable">
          Voir désactivé
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
