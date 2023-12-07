import React from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import styled from "styled-components";

type MultiStringInputProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
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

export const MultiStringInput = ({
  label,
  value,
  onChange,
}: MultiStringInputProps) => {
  const addValue = () => {
    onChange([...value, ""]);
  };

  const removeValue = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, newValue: string) => {
    onChange(value.map((v, i) => (i === index ? newValue : v)));
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
      {value.map((page, index) => (
        <div key={index}>
          <input
            required
            className="fr-input"
            type="text"
            value={page}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="https://example.com"
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
