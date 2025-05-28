export enum SignalementStatusEnum {
  PENDING = "PENDING",
  IGNORED = "IGNORED",
  PROCESSED = "PROCESSED",
  EXPIRED = "EXPIRED",
}

export enum SignalementSubmissionMode {
  FULL = "FULL",
  LIGHT = "LIGHT",
}

export enum SignalementEnabledListKeys {
  API_DEPOT_CLIENTS_ENABLED = "api-depot-clients-enabled",
  SOURCES_MOISSONNEUR_ENABLED = "sources-moissonneur-enabled",
}

export type SignalementCommuneSettings = {
  disabled: boolean;
  filteredSources?: string[];
  mode?: SignalementSubmissionMode;
  message?: string;
};

export enum SignalementSourceType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type SignalementSource = {
  id: string;
  nom: string;
  type: SignalementSourceType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
