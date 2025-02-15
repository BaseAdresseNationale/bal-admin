import express from "express";
import cors from "cors";
import routeGuard from "../../../route-guard";
import * as ReviewsService from "./service";
import { Logger } from "../../../utils/logger.utils";

const reviewsRoutes = express.Router();

reviewsRoutes.use(express.json());
reviewsRoutes.use(cors());

reviewsRoutes.get("/:id/:token", async (req, res) => {
  try {
    await ReviewsService.verifyEmail(req.params.id, req.params.token);
    res.send("Votre email a bien été vérifié");
  } catch (err) {
    Logger.error(
      `Une erreur est survenue lors de la vérification de l'email`,
      err
    );
    res
      .status(500)
      .send("Une erreur est survenue lors de la vérification de l'email");
  }
});

reviewsRoutes.put("/:id", routeGuard, async (req, res) => {
  try {
    const updatedReview = await ReviewsService.updateReview(
      req.params.id,
      req.body
    );

    res.json(updatedReview);
  } catch (err) {
    Logger.error(`Impossible de publier l'avis`, err);
    res.status(500).json({ error: err.message });
  }
});

reviewsRoutes.delete("/:id", routeGuard, async (req, res) => {
  try {
    await ReviewsService.deleteReview(req.params.id);

    res.json(true);
  } catch (err) {
    Logger.error(`Impossible de supprimer l'avis`, err);
    res.status(500).json({ error: err.message });
  }
});

export default reviewsRoutes;
