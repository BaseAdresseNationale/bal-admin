import express from "express";
import cors from "cors";

import routeGuard from "../../route-guard";
import * as EventsService from "./service";
import * as ParticipantsService from "./../participant/service";
import { Logger } from "../../utils/logger.utils";

const eventsRoutes = express.Router();

eventsRoutes.use(express.json());
eventsRoutes.use(cors());

eventsRoutes.get("/", async (req, res) => {
  try {
    const events = await EventsService.findMany(req.query);
    res.json(events);
  } catch (err) {
    Logger.error(`Impossible de récupérer les évènements`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.post("/", routeGuard, async (req, res) => {
  try {
    const event = await EventsService.createOne(req.body);
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de créer un évènement`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.post("/mass-import", routeGuard, async (req, res) => {
  try {
    const events = JSON.parse(req.body.data);
    await EventsService.createMany(events);
    res.json(true);
  } catch (err) {
    Logger.error(`Impossible d'importer en masse des évènements`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.get("/:id", async (req, res) => {
  try {
    const event = await EventsService.findOneOrFail(req.params.id);
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de récupérer l'évènement`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.put("/:id", routeGuard, async (req, res) => {
  try {
    const event = await EventsService.updateOne(req.params.id, req.body);
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de modifier l'évènement`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.delete("/:id", routeGuard, async (req, res) => {
  try {
    const event = await EventsService.deleteOne(req.params.id);
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de supprimer l'évènement`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.get("/:id/participants", async (req, res) => {
  try {
    const event = await ParticipantsService.findManyByEvent(req.params.id);
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de récupérer les participants`, err);
    res.status(500).json({ error: err.message });
  }
});

eventsRoutes.post("/:id/participants", async (req, res) => {
  try {
    const event = await ParticipantsService.createOneByEvent(
      req.params.id,
      req.body
    );
    res.json(event);
  } catch (err) {
    Logger.error(`Impossible de créer un participant`, err);
    res.status(500).json({ error: err.message });
  }
});

export default eventsRoutes;
