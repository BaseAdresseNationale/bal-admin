import express from "express";
import got from "got";
import cors from "cors";
import w from "./w";

const client = got.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_SIGNALEMENT_URL,
  headers: {
    authorization: `Bearer ${process.env.API_SIGNALEMENT_TOKEN}`,
  },
  throwHttpErrors: false,
  responseType: "json",
});

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body);
}

async function updateCommunesDisabled(req, res) {
  const response = await client.put(
    `settings/communes-disabled/${req.params.codeCommune}`
  );
  forward(response, res);
}

const app = express.Router();

app.use(express.json());
app.use(cors());

app.put("/settings/communes-disabled/:codeCommune", w(updateCommunesDisabled));

export default app;
