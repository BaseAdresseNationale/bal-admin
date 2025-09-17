import { AlertProps } from "@codegouvfr/react-dsfr/Alert";
import {
  StatusBaseLocalEnum,
  StatusSyncEnum,
  SyncType,
} from "types/mes-adresses";

export interface StatusInterface {
  label: string;
  title?: string;
  content: string;
  intent?: AlertProps.Severity | "new";
}

export const STATUSES: { [id: string]: StatusInterface } = {
  paused: {
    label: "Suspendue",
    title:
      "Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues, elle n’alimente plus la Base Adresse Nationale",
    content:
      "Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues. Vous pouvez relancer la synchronisation à tout moment.",
    intent: "warning",
  },
  outdated: {
    label: "Mise à jour programmée",
    title: "Cette Base Adresse Locale va alimenter la Base Adresse Nationale",
    content:
      "De nouvelles modifications ont été détectées, elles seront automatiquement répercutées dans la Base Adresse Nationale dans les prochaines heures.",
    intent: "info",
  },
  synced: {
    label: "À jour",
    title: "Cette Base Adresse Locale alimente la Base Adresse Nationale",
    content:
      "Cette Base Adresse Locale est à jour avec la Base Adresse Nationale. Toute modification sera automatiquement répercutée dans la Base Adresse Nationale dans les prochaines heures.",
    intent: "success",
  },
  published: {
    content: "Cette Base Adresse Locale est publiée",
    label: "Publiée",
    intent: "success",
  },
  replaced: {
    label: "Remplacée",
    title:
      "Cette Base Adresse Locale n’alimente plus la Base Adresse Nationale",
    content:
      "Une autre Base Adresses Locale est aussi synchronisée avec la Base Adresse Nationale. Veuillez entrer en contact les administrateurs de l’autre Base Adresse Locale ou notre support: adresse@data.gouv.fr",
    intent: "error",
  },
  draft: {
    content: "Cette Base Adresses Locale est en cours de construction",
    label: "Brouillon",
  },
  demo: {
    content:
      "Base Adresse Locale de démonstration, aucune adresse ne sera transmise à la Base Adresse Nationale",
    label: "Démonstration",
  },
};

export function computeStatus(
  balStatus: StatusBaseLocalEnum,
  sync: SyncType
): StatusInterface {
  if (sync?.isPaused && balStatus !== StatusBaseLocalEnum.REPLACED) {
    return STATUSES.paused;
  } else if (balStatus === StatusBaseLocalEnum.PUBLISHED) {
    return STATUSES[sync.status];
  }
  return STATUSES[balStatus];
}
