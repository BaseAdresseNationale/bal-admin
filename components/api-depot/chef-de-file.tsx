import CopyToClipBoard from "@/components/copy-to-clipboard";
import { ChefDeFile } from "types/api-depot.types";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { getPerimeterLabel } from "../partenaires-de-la-charte/perimeter/perimeter-form";

interface ChefDeFileProps extends ChefDeFile {
  hasChefDeFile: boolean;
}

const ChefDeFileView = ({
  hasChefDeFile,
  id,
  nom,
  email,
  isEmailPublic,
  perimeters,
  isSignataireCharte,
}: ChefDeFileProps) => {
  if (hasChefDeFile) {
    return (
      <div className="fr-container fr-py-4v">
        <h3>{nom}</h3>
        <CopyToClipBoard text={id} title="Id" />
        <CopyToClipBoard text={email} title="Email" />

        <Checkbox
          options={[
            {
              label: "Email public",
              nativeInputProps: {
                checked: isEmailPublic,
                disabled: true,
              },
            },
            {
              label: "Signataire de la charte",
              nativeInputProps: {
                checked: isSignataireCharte,
                disabled: true,
              },
            },
          ]}
          orientation="horizontal"
        />

        <label className="fr-label">Périmètre :</label>
        <ul className="fr-tags-group">
          {perimeters.map((perimeter, index) => (
            <div key={index} className="fr-tag fr-tag--sm fr-tag--dismiss">
              {perimeter.type} -{" "}
              {getPerimeterLabel(perimeter.type, perimeter.code)} -{" "}
              {perimeter.code}{" "}
              {perimeter.expiredAt ? `- ${perimeter.expiredAt}` : null}
            </div>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

export default ChefDeFileView;
