import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { toast } from "react-toastify";
import {
  Sondage,
  SondageQuestion,
  SondageQuestionType,
} from "../../server/lib/bal-widget/entity";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

type SondagesFormProps = {
  sondages: Sondage[];
  onChange: (sondages: Sondage[]) => void;
};

const AVAILABLE_SITES: string[] = (
  process.env.NEXT_PUBLIC_BAL_WIDGET_SITES || ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const GRIST_URL = process.env.NEXT_PUBLIC_GRIST_URL || "";

function getGristDocUrl(gristDocId?: string): string | null {
  if (!gristDocId || !GRIST_URL) return null;
  return `${GRIST_URL}/o/anct/${gristDocId}`;
}

const QUESTION_TYPE_LABELS: Record<SondageQuestionType, string> = {
  [SondageQuestionType.RATING_5_STARS]: "Notation 5 étoiles",
  [SondageQuestionType.FREE_TEXT]: "Texte libre",
};

const RequiredMark = () => (
  <span style={{ color: "var(--text-default-error)" }} aria-hidden="true">
    {" *"}
  </span>
);

export type SondageValidationError = {
  message: string;
  sondageId?: string;
};

export function validateSondages(
  sondages: Sondage[],
): SondageValidationError | null {
  for (const sondage of sondages) {
    if (!sondage.name.trim()) {
      return {
        message: "Un sondage n'a pas de nom",
        sondageId: sondage.id,
      };
    }
    if (!sondage.site) {
      return {
        message: `Le sondage « ${sondage.name} » n'a pas de site défini`,
        sondageId: sondage.id,
      };
    }
    if (sondage.questions.length === 0) {
      return {
        message: `Le sondage « ${sondage.name} » doit contenir au moins une question`,
        sondageId: sondage.id,
      };
    }
    for (const question of sondage.questions) {
      if (!question.label.trim()) {
        return {
          message: `Une question du sondage « ${sondage.name} » est vide`,
          sondageId: sondage.id,
        };
      }
    }
  }
  return null;
}

const StyledSondages = styled.div`
  .sondage-card {
    border: 1px solid var(--border-default-grey);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt-grey);
  }

  .sondage-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .sondage-header > .sondage-name {
    flex: 1;
    min-width: 200px;
  }

  .sondage-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-left: auto;
  }

  .sondage-results-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
  }

  .sondage-body {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--border-default-grey);
  }

  .sondage-section {
    margin-bottom: 1.5rem;
  }

  .sondage-description-editor {
    margin-top: 0.5rem;
  }

  .question-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    margin-bottom: 0.5rem;
  }

  .question-row > :first-child {
    flex: 1;
  }

  .add-sondage-row {
    margin-top: 1rem;
  }
`;

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const SondagesForm = ({ sondages, onChange }: SondagesFormProps) => {
  const updateSondage = (id: string, patch: Partial<Sondage>) => {
    onChange(sondages.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSondage = (id: string) => {
    if (!window.confirm("Supprimer ce sondage ?")) return;
    onChange(sondages.filter((s) => s.id !== id));
  };

  const handleToggleEnabled = (sondage: Sondage) => () => {
    if (!sondage.enabled) {
      // Vérifier qu'aucun autre sondage actif ne cible déjà ce site
      const conflict = sondages.find(
        (s) => s.id !== sondage.id && s.enabled && s.site === sondage.site,
      );
      if (conflict) {
        toast(
          `Impossible d'activer : le sondage « ${conflict.name} » est déjà actif sur ${sondage.site}`,
          { type: "error" },
        );
        return;
      }
      if (!sondage.site) {
        toast("Impossible d'activer un sondage sans site défini", {
          type: "error",
        });
        return;
      }
    }
    updateSondage(sondage.id, { enabled: !sondage.enabled });
  };

  const handleChangeSite = (sondage: Sondage) => (value: string) => {
    if (sondage.enabled) {
      const conflict = sondages.find(
        (s) => s.id !== sondage.id && s.enabled && s.site === value,
      );
      if (conflict) {
        toast(
          `Impossible : le sondage « ${conflict.name} » est déjà actif sur ${value}`,
          { type: "error" },
        );
        return;
      }
    }
    updateSondage(sondage.id, { site: value });
  };

  const addSondage = () => {
    const sondage: Sondage = {
      id: generateId(),
      name: "",
      enabled: false,
      site: "",
      questions: [],
    };
    onChange([...sondages, sondage]);
  };

  const addQuestion = (sondage: Sondage, type: SondageQuestionType) => () => {
    const question: SondageQuestion = {
      id: generateId(),
      type,
      label: "",
    };
    updateSondage(sondage.id, {
      questions: [...sondage.questions, question],
    });
  };

  const updateQuestion =
    (sondage: Sondage, questionId: string) =>
    (patch: Partial<SondageQuestion>) => {
      updateSondage(sondage.id, {
        questions: sondage.questions.map((q) =>
          q.id === questionId ? { ...q, ...patch } : q,
        ),
      });
    };

  const removeQuestion = (sondage: Sondage, questionId: string) => () => {
    updateSondage(sondage.id, {
      questions: sondage.questions.filter((q) => q.id !== questionId),
    });
  };

  const siteOptions = AVAILABLE_SITES.map((site) => ({
    label: site,
    value: site,
  }));

  return (
    <StyledSondages>
      <h4>Sondages</h4>
      {AVAILABLE_SITES.length === 0 && (
        <p className="fr-text--sm">
          ⚠️ Aucun site disponible. Définissez la variable d&apos;environnement{" "}
          <code>NEXT_PUBLIC_BAL_WIDGET_SITES</code>.
        </p>
      )}

      {sondages.length === 0 && (
        <p className="fr-text--sm">Aucun sondage pour le moment.</p>
      )}

      {sondages.map((sondage) => {
        return (
          <div key={sondage.id} className="sondage-card">
            <div className="sondage-header">
              <div className="sondage-name">
                <Input
                  label={
                    <>
                      Nom du sondage
                      <RequiredMark />
                    </>
                  }
                  nativeInputProps={{
                    required: true,
                    value: sondage.name,
                    onChange: (e) =>
                      updateSondage(sondage.id, { name: e.target.value }),
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Select
                  label={
                    <>
                      Site
                      <RequiredMark />
                    </>
                  }
                  nativeSelectProps={{
                    required: true,
                    value: sondage.site,
                    onChange: (e) => handleChangeSite(sondage)(e.target.value),
                  }}
                >
                  <option value="">Sélectionner un site…</option>
                  {siteOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sondage-actions">
                <ToggleSwitch
                  label={
                    sondage.enabled
                      ? "Désactiver ce sondage"
                      : "Activer ce sondage"
                  }
                  checked={sondage.enabled}
                  onChange={handleToggleEnabled(sondage)}
                />
                <Button
                  type="button"
                  priority="tertiary no outline"
                  iconId="fr-icon-delete-line"
                  onClick={() => removeSondage(sondage.id)}
                  title="Supprimer le sondage"
                >
                  Supprimer
                </Button>
                {getGristDocUrl(sondage.gristDocId) && (
                  <a
                    className="sondage-results-link fr-link"
                    href={getGristDocUrl(sondage.gristDocId) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Voir les résultats du sondage sur Grist (nouvel onglet)"
                  >
                    Voir les résultats
                  </a>
                )}
              </div>
            </div>

            <div className="sondage-body">
              <div className="sondage-section">
                <h5>Description</h5>
                <p className="fr-text--sm fr-mb-1w">
                  Texte affiché en tête du sondage. Markdown supporté. Vous
                  pouvez insérer des emojis via le sélecteur de votre OS
                  (⌘⌃Espace sur macOS, Win+. sur Windows).
                </p>
                <div
                  className="sondage-description-editor"
                  data-color-mode="light"
                >
                  <MDEditor
                    value={sondage.description || ""}
                    onChange={(value) =>
                      updateSondage(sondage.id, { description: value || "" })
                    }
                    height={200}
                    preview="live"
                    textareaProps={{
                      placeholder:
                        "Écrivez la description du sondage en Markdown…",
                    }}
                  />
                </div>
              </div>

              <div className="sondage-section">
                <h5>Questions</h5>
                {sondage.questions.length === 0 && (
                  <p className="fr-text--sm">Aucune question.</p>
                )}
                {sondage.questions.map((question) => (
                  <div key={question.id} className="question-row">
                    <Input
                      label={
                        <>
                          {`Question (${QUESTION_TYPE_LABELS[question.type]})`}
                          <RequiredMark />
                        </>
                      }
                      nativeInputProps={{
                        required: true,
                        value: question.label,
                        placeholder:
                          question.type === SondageQuestionType.RATING_5_STARS
                            ? "Comment évaluez-vous… ?"
                            : "Votre commentaire…",
                        onChange: (e) =>
                          updateQuestion(
                            sondage,
                            question.id,
                          )({ label: e.target.value }),
                      }}
                    />
                    <Button
                      type="button"
                      priority="tertiary no outline"
                      iconId="fr-icon-delete-line"
                      onClick={removeQuestion(sondage, question.id)}
                      title="Supprimer la question"
                      aria-label="Supprimer la question"
                    >
                      {""}
                    </Button>
                  </div>
                ))}
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <Button
                    type="button"
                    priority="secondary"
                    iconId="fr-icon-star-line"
                    onClick={addQuestion(
                      sondage,
                      SondageQuestionType.RATING_5_STARS,
                    )}
                  >
                    + Notation 5 étoiles
                  </Button>
                  <Button
                    type="button"
                    priority="secondary"
                    iconId="fr-icon-edit-line"
                    onClick={addQuestion(
                      sondage,
                      SondageQuestionType.FREE_TEXT,
                    )}
                  >
                    + Texte libre
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="add-sondage-row">
        <Button
          type="button"
          priority="primary"
          iconId="fr-icon-add-line"
          onClick={addSondage}
          disabled={AVAILABLE_SITES.length === 0}
        >
          Créer un nouveau sondage
        </Button>
      </div>
    </StyledSondages>
  );
};

export default SondagesForm;
