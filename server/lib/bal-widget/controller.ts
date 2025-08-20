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

export default BALWidgetRoutes;
