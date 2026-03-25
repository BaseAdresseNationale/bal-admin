import React from "react";
import { Perimeter } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";
import { TypePerimeterEnum } from "server/lib/partenaire-de-la-charte/clients/pertimeters/entity";
import { AddPerimeterForm } from "./add-perimeter-form";

type PerimeterFormProps = {
  perimeters: Perimeter[];
  onAdd: (type: TypePerimeterEnum, code: string) => void;
  onRemove: (index: number) => void;
};

export const PerimeterForm = ({ perimeters, onAdd, onRemove }: PerimeterFormProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <AddPerimeterForm onAdd={onAdd} />

      <div>
        <h6 style={{ marginBottom: "0.5rem" }}>
          Périmètres ({perimeters.length})
        </h6>
        {perimeters.length === 0 ? (
          <p className="fr-text--sm fr-text--mention-grey">
            Aucun périmètre défini
          </p>
        ) : (
          <ul className="fr-tags-group">
            {perimeters.map((perimeter, index) => (
              <li key={index}>
                <button
                  className="fr-tag fr-tag--sm fr-tag--dismiss"
                  aria-label={`Supprimer le périmètre ${perimeter.type} ${perimeter.code}`}
                  onClick={() => onRemove(index)}
                  type="button"
                >
                  {perimeter.type} — {perimeter.code}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
