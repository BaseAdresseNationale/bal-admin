const express = require("express");
const cors = require("cors");
const { shuffle } = require("../../utils/random");
const { routeGuard } = require("../../route-guard");
const PartenaireDeLaCharteService = require("./service");

const partenaireDeLaCharteRoutes = new express.Router();

partenaireDeLaCharteRoutes.use(express.json());
partenaireDeLaCharteRoutes.use(cors());

partenaireDeLaCharteRoutes.get("/", async (req, res) => {
  try {
    const partenairesDeLaCharte = await PartenaireDeLaCharteService.findMany(
      req.query
    );
    res.json(partenairesDeLaCharte);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/services", async (req, res) => {
  try {
    const partenairesDeLaCharteServices =
      await PartenaireDeLaCharteService.findDistinct("services");

    res.json(partenairesDeLaCharteServices);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/:id", async (req, res) => {
  try {
    const partenaireDeLaCharte =
      await PartenaireDeLaCharteService.findOneOrFail(req.params.id);
    res.json(partenaireDeLaCharte);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

partenaireDeLaCharteRoutes.get("/:id", async (req, res) => {
  try {
    const partenaireDeLaCharte =
      await PartenaireDeLaCharteService.findOneOrFail(req.params.id);
    res.json(partenaireDeLaCharte);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = partenaireDeLaCharteRoutes;
