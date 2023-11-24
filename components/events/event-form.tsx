/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@codegouvfr/react-dsfr/Button";
import {Input} from '@codegouvfr/react-dsfr/Input'
import {Checkbox} from '@codegouvfr/react-dsfr/Checkbox'
import { EventType, EventTypeTypeEnum } from "types/event";
import SelectInput from '@/components/select-input'
import {capitalize} from '@/lib/util/string'
import { EventTypeTagEnum } from "../../types/event";
import { MultiSelectInput } from "../multi-select-input";

type EventFormProps = {
  title: string | React.ReactNode;
  data?: EventType;
  onSubmit?: (formData: Partial<EventType>) => Promise<void>;
  submitLabel?: string;
  controls?: React.ReactNode;
  isCreation?: boolean;
};

const typeOptions = Object.values(EventTypeTypeEnum).map(value => ({value, label: capitalize(value)}))

const tagOptions = Object.values(EventTypeTagEnum).map(value => ({value, label: capitalize(value)}))

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
  subtitle: "",
  description: "",
  target: "",
  date: "",
  startHour: "",
  endHour: "",
  isOnline: true,
  adresse: {},
  isSubscriptionClosed: false,
  instructions: "",
  tags: [],
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
      <section>
        <h4>
          Informations générales
        </h4>
        <div className='fr-grid-row fr-grid-row--gutters'>

      <div className='fr-col-2'>
        <SelectInput
          label="Type d'évènement*"
          value={formData.type}
          options={typeOptions}
          handleChange={type => {
            setFormData(state => ({
              ...state,
              type: type as EventTypeTypeEnum,
            }))
          }} />
        </div>
        <div className='fr-col-5'>
          <Input
            label='Titre*'
            nativeInputProps={{
              required: true,
              value: formData.title,
              onChange: handleEdit('title'),
            }}
          />
        </div>
        <div className='fr-col-5'>
        <Input
            label='Soutitre'
            nativeInputProps={{
              value: formData.subtitle,
              onChange: handleEdit('subtitle'),
            }}
          />
        </div>
        <div className='fr-col-4'>
        <Input
            label='Description*'
            nativeInputProps={{
              required: true,
              value: formData.description,
              onChange: handleEdit('description'),
            }}
          />
        </div>
        <div className='fr-col-4'>
        <Input
            label='Cible*'
            nativeInputProps={{
              required: true,
              value: formData.target,
              onChange: handleEdit('target'),
            }}
          />
        </div>
        <div className='fr-col-4'>
        <MultiSelectInput
              label='Tags'
              value={formData.tags}
              options={tagOptions}
              placeholder='Sélectionnez un ou plusieurs tags'
              onChange={tags => {
                setFormData(state => ({
                  ...state,
                  tags,
                }))
              }} />
        </div>

        </div>
        </section>
        <section>
        <h4>
          Informations pratiques
        </h4>
        <div className='fr-grid-row fr-grid-row--gutters'>

        <div className='fr-col-4'>
        <Input
            label='Date'
            nativeInputProps={{
              type: 'date',
              value: formData.date,
              onChange: handleEdit('date'),
            }}
          />
        </div>

        <div className='fr-col-4'>
        <Input
            label='Heure de début'
            nativeInputProps={{
              type: 'time',
              value: formData.startHour,
              onChange: handleEdit('startHour'),
            }}
          />
        </div>

        <div className='fr-col-4'>
        <Input
            label='Heure de fin'
            nativeInputProps={{
              type: 'time',
              value: formData.endHour,
              onChange: handleEdit('endHour'),
            }}
          />
        </div>
        <div className='fr-col-6'>
        <Input
            label="Lien d'inscription"
            nativeInputProps={{
              value: formData.href,
              onChange: handleEdit('href'),
            }}
          />
        </div>
        <div className='fr-col-6'>
        <Input
            label='Instructions'
            nativeInputProps={{
              value: formData.instructions,
              onChange: handleEdit('instructions'),
            }}
          />
        </div>
        <div className='fr-col-3'>
        <Checkbox
              options={[
                {
                  label: 'Inscriptions fermées',
                  nativeInputProps: {
                    checked: formData.isSubscriptionClosed,
                    onChange: handleToggle('isSubscriptionClosed'),
                  },
                },
              ]}
            />
        </div>
          </div>
          </section>
        <div className="form-controls">

        <Button type="submit" iconId="fr-icon-save-line">
          {submitLabel || "Enregistrer"}
        </Button>
        {controls}
      </div>
    </StyledForm>
  );
};
