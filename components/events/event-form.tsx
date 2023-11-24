/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { EventType, EventTypeTypeEnum } from "types/event";

type EventFormProps = {
  title: string | React.ReactNode;
  data?: EventType;
  onSubmit?: (formData: Partial<EventType>) => Promise<void>;
  submitLabel?: string;
  controls?: React.ReactNode;
  isCreation?: boolean;
};

const StyledForm = styled.form`
  h3,
  h4 {
    margin-bottom: 1rem;
  }

  section {
    margin: 1rem 0;

    .perimeter-checkbox {
      margin-top: 1rem;
    }
  }

  .form-controls {
    display: flex;
    align-items: center;

    > :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

const newEventForm = {
  type: EventTypeTypeEnum.FORMATION,
  title: "",
};

export const EventForm = ({
  title,
  data,
  onSubmit,
  submitLabel,
  controls,
  isCreation,
}: EventFormProps) => {
  const [formData, setFormData] = useState<Partial<EventType>>(
    data || newEventForm
  );

  const handleEdit =
    (property: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData((state) => ({ ...state, [property]: value }));
    };

  const handleToggle = (property: string) => () => {
    setFormData((state) => ({ ...state, [property]: !state[property] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit} className="fr-my-4w">
      {title}

      <div className="form-controls">
        <Button type="submit" iconId="fr-icon-save-line">
          {submitLabel || "Enregistrer"}
        </Button>
        {controls}
      </div>
    </StyledForm>
  );
};
