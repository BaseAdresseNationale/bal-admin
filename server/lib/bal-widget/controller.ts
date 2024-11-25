import express from "express";
import routeGuard from "../../route-guard";
import * as BALWidgetService from "./service";
import * as MailerService from "../mailer/service";
import { Logger } from "../../utils/logger.utils";

const BALWidgetRoutes = express.Router();

BALWidgetRoutes.use(express.json());

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

BALWidgetRoutes.post("/send-mail", async (req, res) => {
  try {
    await MailerService.sendFormContactMail(req.body);
    res.json(true);
  } catch (err) {
    Logger.error(`Impossible d'envoyer l'email de contact`, err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/send-mail-to-commune", async (req, res) => {
  try {
    await MailerService.sendSignalementToCommune(req.body);
    res.json(true);
  } catch (err) {
    Logger.error(`Impossible d'envoyer l'email à la commune`, err);
    res.status(500).json({ error: err.message });
  }
});

export default BALWidgetRoutes;
