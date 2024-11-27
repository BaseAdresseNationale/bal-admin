import { Dispatch, SetStateAction, useCallback } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

import Perimeter from "@/components/api-depot/client/client-form/perimeter";
import { PerimeterType, TypePerimeterEnum } from "types/api-depot";

interface PerimeterListProps {
  perimeters: PerimeterType[];
  handlePerimeter: Dispatch<SetStateAction<PerimeterType[]>>;
}

const PerimeterList = ({ perimeters, handlePerimeter }: PerimeterListProps) => {
  const removePerimeter = useCallback(
    (event: any, idx: number) => {
      event.preventDefault();
      const cpy: PerimeterType[] = [...perimeters];
      cpy.splice(idx, 1);
      handlePerimeter(cpy);
    },
    [perimeters, handlePerimeter]
  );

  const handleChange = useCallback(
    (perimeter: PerimeterType, idx: number) => {
      const cpy: PerimeterType[] = [...perimeters];
      cpy[idx] = perimeter;

      handlePerimeter(cpy);
    },
    [perimeters, handlePerimeter]
  );

  const addPerimeter = (event) => {
    event.preventDefault();
    const newPerimeter: PerimeterType = {
      type: TypePerimeterEnum.EPCI,
      code: "",
    };
    const cpy: PerimeterType[] = [...perimeters, newPerimeter];
    handlePerimeter(cpy);
  };

  return (
    <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
      <div className="fr-col">
        <h3>Périmètre</h3>
        {perimeters &&
          perimeters.map((p, idx) => (
            <div
              key={idx}
              className="fr-container fr-my-2w fr-grid-row fr-grid-row--gutters fr-grid-row--bottom"
            >
              <div className="fr-col-8">
                <Perimeter
                  type={p.type}
                  code={p.code}
                  handlePerimeter={(p) => handleChange(p, idx)}
                />
              </div>
              <div className="fr-col-2">
                <Button
                  iconId="fr-icon-delete-bin-line"
                  onClick={(e) => removePerimeter(e, idx)}
                  priority="tertiary no outline"
                  title="Remove perimeter"
                />
              </div>
            </div>
          ))}

        {perimeters &&
          perimeters.every(({ code }) => code && code.length > 0) && (
            <div className="fr-col">
              <Button
                priority="secondary"
                iconId="fr-icon-add-line"
                onClick={addPerimeter}
              >
                Ajouter un périmètre
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default PerimeterList;
