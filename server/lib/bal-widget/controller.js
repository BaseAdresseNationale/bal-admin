const express = require("express");
const cors = require("cors");
const {routeGuard} = require('../../route-guard')
const BALWidgetService = require("./service");
const MailerService = require("../mailer/service");

const BALWidgetRoutes = new express.Router();

BALWidgetRoutes.use(express.json());
BALWidgetRoutes.use(cors());

BALWidgetRoutes.get("/config", async (req, res) => {
  try {
    const config = await BALWidgetService.getConfig(req.query);
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/config", routeGuard, async (req, res) => {
  try {
    const config = await BALWidgetService.setConfig(req.body);
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/send-mail", async (req, res) => {
  try {
    await MailerService.sendFormContactMail(req.body);
    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

BALWidgetRoutes.post("/send-mail-to-commune", async (req, res) => {
  try {
    await MailerService.sendSignalementToCommune(req.body);
    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = BALWidgetRoutes;
