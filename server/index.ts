#!/usr/bin/env node

import express from "express";
import next from "next";
import * as dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./utils/typeorm-client";
import routeGuard from "./route-guard";
// PROXY
import ProxyApiDepot from "./proxy/api-depot.proxy";
import ProxyMoissonneurBal from "./proxy/moissonneur-bal.proxy";
import ProxyMesAdressesApi from "./proxy/mes-adresses-api.proxy";
// CONTROLLER
import PartenaireDeLaCharteController from "./lib/partenaire-de-la-charte/controller";
import EventController from "./lib/events/controller";
import BalWidgetController from "./lib/bal-widget/controller";

function setDemoClient(req, res, next) {
  req.demo = 1;
  next();
}

async function main() {
  const server: express.Express = express();

  const port: string | number = process.env.PORT || 9000;
  const dev: boolean = process.env.NODE_ENV !== "production";

  const nextApp = next({ dev });
  const nextAppRequestHandler = nextApp.getRequestHandler();

  await nextApp.prepare();

  await AppDataSource.initialize();

  server.use(express.json({ limit: "5mb" }));
  server.use(
    express.urlencoded({
      extended: true,
      limit: "5mb",
    })
  );

  // Proxy routes are protected by routeGuard
  server.use("/api/proxy-api-depot", routeGuard, ProxyApiDepot);
  server.use(
    "/api/proxy-api-depot-demo",
    routeGuard,
    setDemoClient,
    ProxyApiDepot
  );
  server.use("/api/proxy-api-moissonneur-bal", routeGuard, ProxyMoissonneurBal);
  server.use("/api/proxy-mes-adresses-api", routeGuard, ProxyMesAdressesApi);

  // Some Partenaire de la charte routes are public, others are protected by routeGuard
  server.use("/api/partenaires-de-la-charte", PartenaireDeLaCharteController);
  server.use("/api/events", EventController);
  server.use("/api/bal-widget", BalWidgetController);

  server.use(async (req, res) => {
    // Authentification is handled by the next app using next-auth module
    await nextAppRequestHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`Start listening on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
