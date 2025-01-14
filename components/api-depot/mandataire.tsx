import CopyToClipBoard from "@/components/copy-to-clipboard";
import { Mandataire as MandataireType } from "../../types/api-depot.types";

const Mandataire = ({ id, nom, email }: MandataireType) => (
  <div className="fr-py-4v">
    <h1 className="fr-m-1v">Mandataire</h1>
    <div className="fr-container fr-py-4v">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col">
          <h3>{nom}</h3>
          <CopyToClipBoard text={id} title="Id" />
          <CopyToClipBoard text={email} title="Email" />
        </div>
      </div>
    </div>
  </div>
);

export default Mandataire;
