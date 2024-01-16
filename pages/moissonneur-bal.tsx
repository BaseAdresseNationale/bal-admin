import { getSources } from "@/lib/api-moissonneur-bal";

import MoissoneurSourceItem from "@/components/moissonneur-bal/moissonneur-source-item";
import { SourceMoissoneurType } from "types/moissoneur";
import { useState } from "react";

type MoissoneurBALProps = {
  sources: SourceMoissoneurType[];
};

const MoissoneurBAL = ({ sources }: MoissoneurBALProps) => {
  const getFilteredSource = (showDeleted: boolean): SourceMoissoneurType[] => {
    if (showDeleted) {
      return sources;
    }
    return sources.filter((s) => !s._deleted);
  };

  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [sourcesFiltered, setSourcesFiltered] = useState<
    SourceMoissoneurType[]
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
              <th scope="col">Nom</th>
              <th scope="col">Modèle</th>
              <th scope="col">Type</th>
              <th scope="col">Actif</th>
              <th scope="col">Date de mise à jour</th>
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

export async function getServerSideProps() {
  const sources = await getSources();

  return {
    props: { sources },
  };
}

export default MoissoneurBAL;
