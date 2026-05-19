import { Sondage, SondageQuestion, SondageQuestionType } from "./entity";
const GRIST_URL = process.env.NEXT_PUBLIC_GRIST_URL;
const GRIST_API_URL = GRIST_URL ? `${GRIST_URL}/api` : undefined;
const GRIST_API_KEY = process.env.GRIST_API_KEY;
const GRIST_WORKSPACE_ID = process.env.GRIST_WORKSPACE_ID;

export const RESPONSES_TABLE_ID = "Responses";
const SUBMITTED_AT_COL_ID = "submitted_at";

function assertGristConfigured() {
  if (!GRIST_API_URL || !GRIST_API_KEY || !GRIST_WORKSPACE_ID) {
    throw new Error(
      "Configuration Grist incomplète : NEXT_PUBLIC_GRIST_URL, GRIST_API_KEY et GRIST_WORKSPACE_ID sont requis",
    );
  }
}

/**
 * Convertit un id de question (UUID avec tirets, peut commencer par un chiffre)
 * en colId Grist valide (commence par lettre/_, alphanumériques + _).
 */
export function questionColId(questionId: string): string {
  return `q_${questionId.replace(/-/g, "_")}`;
}

function questionGristType(question: SondageQuestion): string {
  switch (question.type) {
    case SondageQuestionType.RATING_5_STARS:
      return "Int";
    case SondageQuestionType.FREE_TEXT:
    default:
      return "Text";
  }
}

async function gristFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  assertGristConfigured();
  const response = await fetch(`${GRIST_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GRIST_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Grist API ${init.method || "GET"} ${path} failed (${
        response.status
      }): ${body}`,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * Crée un document Grist pour le sondage avec une table Responses qui contient
 * une colonne par question + une colonne submitted_at.
 */
export async function createSondageDoc(sondage: Sondage): Promise<string> {
  assertGristConfigured();

  const docId = await gristFetch<string>(
    `/workspaces/${GRIST_WORKSPACE_ID}/docs`,
    {
      method: "POST",
      body: JSON.stringify({ name: `Sondage - ${sondage.name}` }),
    },
  );

  const columns = [
    {
      id: SUBMITTED_AT_COL_ID,
      fields: { label: "Soumis le", type: "DateTime:Europe/Paris" },
    },
    ...sondage.questions.map((q) => ({
      id: questionColId(q.id),
      fields: { label: q.label, type: questionGristType(q) },
    })),
  ];

  await gristFetch(`/docs/${docId}/tables`, {
    method: "POST",
    body: JSON.stringify({
      tables: [{ id: RESPONSES_TABLE_ID, columns }],
    }),
  });

  return docId;
}

/**
 * Synchronise les colonnes de la table Responses avec la liste des questions
 * du sondage. Ajoute les colonnes manquantes et met à jour les libellés.
 * Ne supprime jamais de colonne (pour préserver les réponses historiques).
 */
export async function syncSondageDocColumns(sondage: Sondage): Promise<void> {
  if (!sondage.gristDocId) return;

  const data = await gristFetch<{
    columns: Array<{ id: string; fields: any }>;
  }>(`/docs/${sondage.gristDocId}/tables/${RESPONSES_TABLE_ID}/columns`);
  const existingById = new Map(data.columns.map((c) => [c.id, c]));

  const toAdd: Array<{ id: string; fields: { label: string; type: string } }> =
    [];
  const toUpdate: Array<{ id: string; fields: { label: string } }> = [];

  for (const q of sondage.questions) {
    const colId = questionColId(q.id);
    const existing = existingById.get(colId);
    if (!existing) {
      toAdd.push({
        id: colId,
        fields: { label: q.label, type: questionGristType(q) },
      });
    } else if (existing.fields?.label !== q.label) {
      toUpdate.push({ id: colId, fields: { label: q.label } });
    }
  }

  if (toAdd.length > 0) {
    await gristFetch(
      `/docs/${sondage.gristDocId}/tables/${RESPONSES_TABLE_ID}/columns`,
      {
        method: "POST",
        body: JSON.stringify({ columns: toAdd }),
      },
    );
  }

  if (toUpdate.length > 0) {
    await gristFetch(
      `/docs/${sondage.gristDocId}/tables/${RESPONSES_TABLE_ID}/columns`,
      {
        method: "PATCH",
        body: JSON.stringify({ columns: toUpdate }),
      },
    );
  }
}

/**
 * Insère une réponse dans la table Responses du document Grist du sondage.
 * `answers` : map { questionId -> valeur }.
 */
export async function addSondageResponse(
  sondage: Sondage,
  answers: Record<string, string | number>,
): Promise<void> {
  if (!sondage.gristDocId) {
    throw new Error(`Le sondage "${sondage.name}" n'a pas de document Grist`);
  }
  const fields: Record<string, string | number> = {
    [SUBMITTED_AT_COL_ID]: Math.floor(Date.now() / 1000),
  };
  for (const [questionId, value] of Object.entries(answers)) {
    fields[questionColId(questionId)] = value;
  }

  await gristFetch(
    `/docs/${sondage.gristDocId}/tables/${RESPONSES_TABLE_ID}/records`,
    {
      method: "POST",
      body: JSON.stringify({ records: [{ fields }] }),
    },
  );
}
