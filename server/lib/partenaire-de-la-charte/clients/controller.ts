import express from "express";
import cors from "cors";
import routeGuard from "../../../route-guard";
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

export default clientsRoutes;
