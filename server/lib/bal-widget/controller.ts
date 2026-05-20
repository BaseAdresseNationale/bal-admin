import express from "express";
import cors from "cors";
import routeGuard from "../../route-guard";
import * as BALWidgetService from "./service";
import { Logger } from "../../utils/logger.utils";

const BALWidgetRoutes = express.Router();

BALWidgetRoutes.use(express.json());
BALWidgetRoutes.use(cors());

BALWidgetRoutes.get("/config", async (req, res) => {
  try {
    const config = await BALWidgetService.getConfig();
    res.json(config);
  } catch (err) {
    Logger.error(`Impossible de récupérer le config de BalWidget`, err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/config", routeGuard, async (req, res) => {
  try {
    const config = await BALWidgetService.setConfig(req.body);
    res.json(config);
  } catch (err) {
    Logger.error(`Impossible de créer le config de BalWidget`, err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/sondages/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;
    const answers =
      req.body && typeof req.body === "object" ? req.body.answers : null;
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      res.status(400).json({
        error: "Le payload doit contenir un objet `answers`",
      });
      return;
    }
    await BALWidgetService.submitSondageResponse(id, answers);
    res.status(204).send();
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) {
      Logger.error(
        `Erreur lors de la soumission de la réponse au sondage ${req.params.id}`,
        err,
      );
    }
    res.status(status).json({ error: err.message });
  }
});

export default BALWidgetRoutes;
