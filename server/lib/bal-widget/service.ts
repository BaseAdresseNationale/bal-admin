import { ObjectId } from "bson";
import { AppDataSource } from "../../utils/typeorm-client";
import { BalWidget, Sondage, SondageQuestionType } from "./entity";
import {
  addSondageResponse,
  createSondageDoc,
  syncSondageDocColumns,
} from "./grist";

const balWidgetRepository = AppDataSource.getRepository(BalWidget);

export async function getConfig(): Promise<BalWidget> {
  try {
    const { id, createdAt, updatedAt, ...record } =
      await balWidgetRepository.findOneByOrFail({});
    return record;
  } catch (error) {
    return null;
  }
}

async function syncSondagesWithGrist(sondages: Sondage[]): Promise<Sondage[]> {
  if (!sondages || sondages.length === 0) return sondages || [];
  return Promise.all(
    sondages.map(async (sondage) => {
      if (!sondage.gristDocId) {
        const gristDocId = await createSondageDoc(sondage);
        return { ...sondage, gristDocId };
      }
      await syncSondageDocColumns(sondage);
      return sondage;
    }),
  );
}

export async function setConfig(payload: BalWidget) {
  const existing = await getConfig();
  const existingPublished = new Map(
    (existing?.sondages || [])
      .filter((s) => s.gristDocId)
      .map((s) => [s.id, s]),
  );

  // Un sondage publié (avec gristDocId) est immuable : on ne préserve
  // du payload que les champs modifiables (enabled).
  payload.sondages = (payload.sondages || []).map((s) => {
    const locked = existingPublished.get(s.id);
    if (!locked) return s;
    return { ...locked, enabled: Boolean(s.enabled) };
  });

  payload.sondages = await syncSondagesWithGrist(payload.sondages);

  const record = await balWidgetRepository.findOneBy({});
  if (!record) {
    payload.id = new ObjectId().toHexString();
    await balWidgetRepository.insert(payload);
  } else {
    await balWidgetRepository.update({ id: record.id }, payload);
  }

  return getConfig();
}

export async function submitSondageResponse(
  sondageId: string,
  answers: Record<string, string | number | boolean>,
): Promise<void> {
  const config = await getConfig();
  const sondage = config?.sondages?.find((s) => s.id === sondageId);

  if (!sondage) {
    const err: any = new Error("Sondage introuvable");
    err.status = 404;
    throw err;
  }
  if (!sondage.enabled) {
    const err: any = new Error("Sondage désactivé");
    err.status = 403;
    throw err;
  }

  // Validation stricte du payload : chaque clé doit correspondre à une question
  // du sondage, et la valeur doit être du bon type.
  const questionsById = new Map(sondage.questions.map((q) => [q.id, q]));
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [questionId, value] of Object.entries(answers)) {
    const question = questionsById.get(questionId);
    if (!question) {
      const err: any = new Error(`Question inconnue : ${questionId}`);
      err.status = 400;
      throw err;
    }
    if (question.type === SondageQuestionType.RATING_5_STARS) {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        const err: any = new Error(
          `Valeur invalide pour la question "${question.label}" : entier entre 1 et 5 attendu`,
        );
        err.status = 400;
        throw err;
      }
      cleaned[questionId] = n;
    } else if (question.type === SondageQuestionType.FREE_TEXT) {
      if (typeof value !== "string") {
        const err: any = new Error(
          `Valeur invalide pour la question "${question.label}" : texte attendu`,
        );
        err.status = 400;
        throw err;
      }
      // Borne de sécurité pour éviter les payloads abusifs
      cleaned[questionId] = value.slice(0, 5000);
    } else if (question.type === SondageQuestionType.YES_NO) {
      if (typeof value !== "boolean") {
        const err: any = new Error(
          `Valeur invalide pour la question "${question.label}" : booléen attendu`,
        );
        err.status = 400;
        throw err;
      }
      cleaned[questionId] = value;
    }
  }

  await addSondageResponse(sondage, cleaned);
}
