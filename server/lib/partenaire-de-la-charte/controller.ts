import express from "express";
import { shuffle } from "../../utils/random";
import routeGuard from "../../route-guard";
import * as PartenaireDeLaCharteService from "./service";
import { PartenaireDeLaCharteServiceEnum } from "./entity";
import { Logger } from "../../utils/logger.utils";

const partenaireDeLaCharteRoutes = express.Router();

partenaireDeLaCharteRoutes.use(express.json());

partenaireDeLaCharteRoutes.get("/", async (req, res) => {
  try {
    const partenairesDeLaCharte = await PartenaireDeLaCharteService.findMany(
      req.query
    );
    res.json(partenairesDeLaCharte);
  } catch (err) {
    Logger.error(`Impossible de récupérer les partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/paginated", async (req, res) => {
  try {
    const { page, limit, ...query } = req.query;
    const partenairesDeLaCharte =
      await PartenaireDeLaCharteService.findManyPaginated(
        query,
        parseInt(page as string),
        parseInt(limit as string)
      );
    res.json(partenairesDeLaCharte);
  } catch (err) {
    Logger.error(`Impossible de récupérer les partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/random", async (req, res) => {
  try {
    const { limit } = req.query;
    const partenairesDeLaCharte = await PartenaireDeLaCharteService.findMany();
    let randomizedPartners = shuffle(partenairesDeLaCharte);
    if (limit) {
      randomizedPartners = randomizedPartners.slice(0, limit);
    }

    res.json(randomizedPartners);
  } catch (err) {
    Logger.error(`Impossible de récupérer les partenaires`, err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/services", async (req, res) => {
  try {
    res.json(Object.values(PartenaireDeLaCharteServiceEnum));
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

partenaireDeLaCharteRoutes.get("/:id", async (req, res) => {
  try {
    const partenaireDeLaCharte =
      await PartenaireDeLaCharteService.findOneOrFail(req.params.id);
    res.json(partenaireDeLaCharte);
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

export default partenaireDeLaCharteRoutes;
