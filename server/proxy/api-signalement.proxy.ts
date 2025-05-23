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

async function updateCommuneSettings(req, res) {
  const response = await client.post(
    `settings/commune-settings/${req.params.codeCommune}`,
    { json: req.body }
  );
  forward(response, res);
}

async function updateEnabledList(req, res) {
  const response = await client.put(
    `settings/enabled-list/${req.params.listKey}`,
    { json: req.body }
  );
  forward(response, res);
}

const app = express.Router();

app.use(express.json());
app.use(cors());

app.post("/settings/commune-settings/:codeCommune", w(updateCommuneSettings));
app.put("/settings/enabled-list/:listKey", w(updateEnabledList));

export default app;
