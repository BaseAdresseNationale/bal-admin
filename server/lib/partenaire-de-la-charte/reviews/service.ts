import { sendReviewReceived } from "../..//mailer/service";
import { AppDataSource } from "../../../utils/typeorm-client";
import { Review } from "./entity";
import * as PartenaireDeLaCharteService from "../service";
import { ObjectId } from "bson";
import { Logger } from "../../../utils/logger.utils";

const reviewRepository = AppDataSource.getRepository(Review);

export async function findOneOrFail(id: string) {
  const record = await reviewRepository.findOneByOrFail({ id });

  if (!record) {
    throw new Error(`Review ${id} introuvable`);
  }

  return record;
}

export async function addReview(
  partenaireId: string,
  payload: any
): Promise<Review> {
  await PartenaireDeLaCharteService.findOneOrFail(partenaireId);

  const review: Review = {
    ...payload,
    partenaireId,
    isPublished: false,
  };

  const entityToSave = await reviewRepository.create(review);
  entityToSave.id = new ObjectId().toHexString();
  const newRecord = await reviewRepository.save(entityToSave);

  try {
    await sendReviewReceived(partenaireId);
  } catch (error) {
    Logger.error(
      `Une erreur est survenue lors de l'envoie de la notification de review`,
      error
    );
  }

  return newRecord;
}

export async function updateReview(reviewId: string, payload: any) {
  const review = await findOneOrFail(reviewId);
  review.isPublished = payload.isPublished;
  return reviewRepository.save(review);
}

export async function deleteReview(reviewId: string) {
  const review = await findOneOrFail(reviewId);
  await reviewRepository.delete({ id: review.id });
}
