import PropTypes from "prop-types";

import { getEPCI, getDepartement, getCommune } from "@/lib/cog";

import CopyToClipBoard from "@/components/copy-to-clipboard";
import {
  ChefDeFileApiDepotType,
  PerimeterType,
  TypePerimeterEnum,
} from "types/api-depot";

function getPerimeters(perimetre: PerimeterType[]) {
  return perimetre
    ? perimetre.map((p) => {
        const { type, code } = p;

        if (type === TypePerimeterEnum.EPCI) {
          return `EPCI de ${getEPCI(code).nom} (${code})`;
        }

        if (type === TypePerimeterEnum.DEPARTEMENT) {
          return `Département de ${getDepartement(code).nom} (${code})`;
        }

        if (type === TypePerimeterEnum.COMMUNE) {
          return `Commune de ${getCommune(code).nom} (${code})`;
        }

        return "inconnu";
      })
    : null;
}

interface ChefDeFileProps extends ChefDeFileApiDepotType {
  hasChefDeFile: boolean;
}

const ChefDeFile = ({
  hasChefDeFile,
  _id,
  nom,
  email,
  isEmailPublic,
  perimetre,
  signataireCharte,
}: ChefDeFileProps) => {
  const perimeters = getPerimeters(perimetre);
  return (
    <div className="fr-py-4v">
      <h1 className="fr-m-1v">Chef de file</h1>
      {hasChefDeFile ? (
        <div className="fr-container fr-py-4v">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <div className="fr-col-10">
              <h3>{nom}</h3>
              <CopyToClipBoard text={_id} title="Id" />
              <CopyToClipBoard text={email} title="Email" />
              <div className="fr-col">
                <input
                  type="checkbox"
                  id="checkbox"
                  name="checkbox"
                  checked={isEmailPublic}
                  disabled
                />
                <label className="fr-label" htmlFor="checkbox">
                  Email Public
                </label>
              </div>
            </div>

            <div className="fr-col">
              <input
                type="checkbox"
                id="checkbox"
                name="checkbox"
                checked={signataireCharte}
                disabled
              />
              <label className="fr-label" htmlFor="checkbox">
                signataire de la charte
              </label>
            </div>
          </div>

          <div className="fr-my-2w">
            <label className="fr-label">Périmètre :</label>
            <ul>
              {perimeters
                ? perimeters.map((p) => <li key={p}>{p}</li>)
                : "Aucune périmètre n’est défini"}
            </ul>
          </div>
        </div>
      ) : (
        <div className="fr-container fr-py-4v">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col">Aucun chef de file</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDeFile;
