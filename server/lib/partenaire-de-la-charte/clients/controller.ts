import express from "express";
import cors from "cors";
import routeGuard from "../../../route-guard";
import adminGuard from "../../../admin-guard";
import * as ClientService from "./service";
import { Logger } from "../../../utils/logger.utils";

const clientsRoutes = express.Router();

clientsRoutes.use(express.json());
clientsRoutes.use(cors());

clientsRoutes.get("/", routeGuard, async (_req, res) => {
  try {
    const clients = await ClientService.findAll();
    res.json(clients);
  } catch (err) {
    Logger.error(`Impossible de récupérer les clients`, err);
    res.status(500).json({ error: err.message });
  }
});

clientsRoutes.post("/", adminGuard, async (req, res) => {
  try {
    const client = await ClientService.createOne(req.body);
    res.status(201).json(client);
  } catch (err) {
    Logger.error(`Impossible de créer le client`, err);
    res.status(500).json({ error: err.message });
  }
});

clientsRoutes.put("/:clientId", adminGuard, async (req, res) => {
  try {
    const client = await ClientService.updateOne(req.params.clientId, req.body);
    res.json(client);
  } catch (err) {
    Logger.error(`Impossible de modifier le client`, err);
    res.status(500).json({ error: err.message });
  }
});

clientsRoutes.put("/:clientId/restore", adminGuard, async (req, res) => {
  try {
    await ClientService.restore(req.params.clientId);
    res.status(204).send();
  } catch (err) {
    Logger.error(`Impossible de modifier le client`, err);
    res.status(500).json({ error: err.message });
  }
});

clientsRoutes.delete("/:clientId", adminGuard, async (req, res) => {
  try {
    await ClientService.deleteOne(req.params.clientId);
    res.status(204).send();
  } catch (err) {
    Logger.error(`Impossible de supprimer le client`, err);
    res.status(500).json({ error: err.message });
  }
});

export default clientsRoutes;
