import express from "express";
import cors from "cors";
import { keyBy } from "lodash";
import * as StatsService from "./service";
import { Logger } from "../../utils/logger.utils";

const statsRoutes = express.Router();

statsRoutes.use(express.json());
statsRoutes.use(cors());

statsRoutes.get("", async (req, res) => {
  try {
    const events = await StatsService.findAllStats();
    const result = keyBy(events, "name");
    res.json(result);
  } catch (err) {
    Logger.error(`Impossible de récupérer les stats`, err);
    res.status(500).json({ error: err.message });
  }
});

export default statsRoutes;
