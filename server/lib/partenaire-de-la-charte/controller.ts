import express from "express";
import cors from "cors";
import routeGuard from "../../route-guard";
import * as PartenaireDeLaCharteService from "./service";
import * as ReviewsService from "./reviews/service";
import { Logger } from "../../utils/logger.utils";
import { isAdmin } from "../../is-admin";
import { mapPartenairePublicReviews } from "./reviews/mapper";

const partenaireDeLaCharteRoutes = express.Router();

partenaireDeLaCharteRoutes.use(express.json());
partenaireDeLaCharteRoutes.use(cors());

partenaireDeLaCharteRoutes.get("/", isAdmin, async (req, res) => {
  try {
    const partenairesDeLaCharte = await PartenaireDeLaCharteService.findMany(
      req.query
    );

    res.json(
      (req as any).isAdmin
        ? partenairesDeLaCharte
        : partenairesDeLaCharte.map((partenaire) =>
            mapPartenairePublicReviews(partenaire)
          )
    );
  } catch (err) {
    Logger.error(`Impossible de récupérer les partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/paginated", isAdmin, async (req, res) => {
  try {
    const { page, limit, ...query } = req.query;
    const paginatedPartenairesDeLaCharte =
      await PartenaireDeLaCharteService.findManyPaginated(
        query,
        parseInt(page as string),
        parseInt(limit as string)
      );

    res.json({
      ...paginatedPartenairesDeLaCharte,
      data: (req as any).isAdmin
        ? paginatedPartenairesDeLaCharte.data
        : paginatedPartenairesDeLaCharte.data.map((partenaire) =>
            mapPartenairePublicReviews(partenaire)
          ),
    });
  } catch (err) {
    Logger.error(`Impossible de récupérer les partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/services", async (req, res) => {
  try {
    const result = await PartenaireDeLaCharteService.findServicesWithCount(
      req.query
    );

    res.json(result);
  } catch (err) {
    Logger.error(`Impossible de récupérer les services de partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.post("/", routeGuard, async (req, res) => {
  try {
    const partenaireDeLaCharte = await PartenaireDeLaCharteService.createOne(
      req.body
    );
    res.json(partenaireDeLaCharte);
  } catch (err) {
    Logger.error(`Impossible de créer un partenaire`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.post("/candidate", async (req, res) => {
  try {
    const partenaireDeLaCharte = await PartenaireDeLaCharteService.createOne(
      req.body,
      { isCandidate: true }
    );
    res.json(partenaireDeLaCharte);
  } catch (err) {
    Logger.error(`Impossible de candidater pour être partenaire`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/:id", isAdmin, async (req, res) => {
  try {
    const partenaireDeLaCharte =
      await PartenaireDeLaCharteService.findOneOrFail(req.params.id);

    res.json(
      (req as any).isAdmin
        ? partenaireDeLaCharte
        : mapPartenairePublicReviews(partenaireDeLaCharte)
    );
  } catch (err) {
    Logger.error(`Impossible de récupérer le partenaire`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.put("/:id", routeGuard, async (req, res) => {
  try {
    const acceptCandidacy = req.query.acceptCandidacy === "true";
    const partenaireDeLaCharte = await PartenaireDeLaCharteService.updateOne(
      req.params.id,
      req.body,
      { acceptCandidacy }
    );
    res.json(partenaireDeLaCharte);
  } catch (err) {
    Logger.error(`Impossible de modifier le partenaire`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.delete("/:id", routeGuard, async (req, res) => {
  try {
    const response = await PartenaireDeLaCharteService.deleteOne(req.params.id);
    res.json(response);
  } catch (err) {
    Logger.error(`Impossible de supprimer le partenaire`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.post("/:id/review", async (req, res) => {
  try {
    const review = await ReviewsService.addReview(req.params.id, req.body);

    res.json(review);
  } catch (err) {
    Logger.error(
      `Une erreur est survenue lors de l'enregistrement de l'avis`,
      err
    );
    res.status(500).json({ error: err.message });
  }
});

export default partenaireDeLaCharteRoutes;
