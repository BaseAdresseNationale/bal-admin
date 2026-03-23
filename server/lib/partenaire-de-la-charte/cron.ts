import { schedule } from "node-cron";
import { syncClients } from "./sync.service";
import { Logger } from "../../utils/logger.utils";

export const cronPartenaires = async () => {
  await syncClients().catch((error) => {
    Logger.error("CRON: erreur lors de la synchronisation initiale des clients partenaires", error);
  });

  schedule("0 0 * * *", () => {
    // Cette tâche s'exécute tous les jours à minuit
    syncClients().catch((error) => {
      Logger.error("CRON: erreur lors de la synchronisation des clients partenaires", error);
    });
  });
};
