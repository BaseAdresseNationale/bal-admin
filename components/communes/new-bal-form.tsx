import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

type DataSource = "ban" | "file";

type NewBalFormProps = {
  codeCommune: string;
  onSubmit: (
    nom: string,
    emails: string[],
    source: DataSource,
    file: File | null,
  ) => Promise<void>;
};

const StyledForm = styled.form`
  section {
    margin: 1.5rem 0;
  }

  .email-input-row {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
  }

  .email-input-row > :first-child {
    flex: 1;
  }

  .email-list {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .email-tag {
    display: inline-flex;
    align-items: center;
    background-color: var(--background-contrast-grey);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  .email-tag button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    color: var(--text-default-grey);
  }

  .form-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const NewBalForm = ({ codeCommune, onSubmit }: NewBalFormProps) => {
  const [nom, setNom] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [source, setSource] = useState<DataSource>("ban");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails((prev) => [...prev, trimmed]);
    }
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) return;
    if (source === "file" && !file) return;
    setIsSubmitting(true);
    try {
      await onSubmit(nom, emails, source, file);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit} className="fr-my-4w">
      <section>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <Input
              label="Nom de la BAL *"
              nativeInputProps={{
                required: true,
                value: nom,
                onChange: (e) => setNom(e.target.value),
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <label className="fr-label">Adresses emails administrateur *</label>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-6">
            <div className="email-input-row">
              <Input
                label=""
                nativeInputProps={{
                  type: "email",
                  value: emailInput,
                  placeholder: "exemple@domaine.fr",
                  onChange: (e) => setEmailInput(e.target.value),
                  onKeyDown: handleEmailKeyDown,
                }}
              />
              <Button
                type="button"
                priority="secondary"
                iconId="fr-icon-add-line"
                onClick={addEmail}
                disabled={!emailInput.trim()}
              >
                Ajouter
              </Button>
            </div>
            {emails.length > 0 && (
              <div className="email-list">
                {emails.map((email) => (
                  <span key={email} className="email-tag">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      aria-label={`Supprimer ${email}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <RadioButtons
          legend="Source des données"
          options={[
            {
              label: "Utiliser la BAN (peuplement automatique)",
              nativeInputProps: {
                value: "ban",
                checked: source === "ban",
                onChange: () => setSource("ban"),
              },
            },
            {
              label: "Importer un fichier BAL (CSV)",
              nativeInputProps: {
                value: "file",
                checked: source === "file",
                onChange: () => setSource("file"),
              },
            },
          ]}
        />
        {source === "file" && (
          <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
            <div className="fr-col-6">
              <Input
                label="Fichier BAL *"
                nativeInputProps={{
                  type: "file",
                  accept: ".csv",
                  ref: fileInputRef,
                  onChange: (e) => setFile(e.target.files?.[0] ?? null),
                }}
              />
            </div>
          </div>
        )}
      </section>

      <div className="form-controls">
        <Button
          type="submit"
          iconId="fr-icon-save-line"
          disabled={
            isSubmitting ||
            emails.length === 0 ||
            (source === "file" && !file)
          }
        >
          {isSubmitting ? "Création en cours…" : "Créer la BAL"}
        </Button>
      </div>
    </StyledForm>
  );
};
