import React from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import styled from "styled-components";
import { BALWidgetLink } from "../types/bal-widget";

type MultiLinkInputProps = {
  label: string;
  value: BALWidgetLink[];
  placeholders?: string[];
  onChange: (value: BALWidgetLink[]) => void;
};

const StyledWrapper = styled.div`
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const MultiLinkInput = ({
  label,
  value,
  onChange,
  placeholders = [],
}: MultiLinkInputProps) => {
  const addValue = () => {
    onChange([...value, { label: "", url: "" }]);
  };

  const removeValue = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    property: keyof BALWidgetLink,
    newValue: string
  ) => {
    onChange(
      value.map((v, i) => (i === index ? { ...v, [property]: newValue } : v))
    );
  };

  return (
    <StyledWrapper>
      <div>
        <label>{label}</label>
        <Button
          type="button"
          title="Ajouter"
          onClick={addValue}
          iconId="fr-icon-add-line"
        />
      </div>
      {value.map(({ label, url }, index) => (
        <div key={index}>
          <input
            required
            className="fr-input"
            type="text"
            value={label}
            onChange={(e) => handleChange(index, "label", e.target.value)}
            placeholder={placeholders[0]}
          />
          <input
            required
            className="fr-input"
            type="text"
            value={url}
            onChange={(e) => handleChange(index, "url", e.target.value)}
            placeholder={placeholders[1]}
          />
          <Button
            type="button"
            title="Supprimer"
            onClick={() => removeValue(index)}
            iconId="fr-icon-delete-bin-line"
          />
        </div>
      ))}
    </StyledWrapper>
  );
};
