export enum StatusBaseLocalEnum {
  DRAFT = "draft",
  PUBLISHED = "published",
  DEMO = "demo",
  REPLACED = "replaced",
}

export enum StatusSyncEnum {
  OUTDATED = "outdated",
  SYNCED = "synced",
  CONFLICT = "conflict",
}

export type BaseLocaleType = {
  id: string;
  token?: string;
  nom?: string;
  status?: StatusBaseLocalEnum;
  commune?: string;
  nbNumeros?: number;
  nbNumerosCertifies?: number;
  isAllCertified?: boolean;
  commentedNumeros?: any;
  emails?: string[];
  sync?: {
    status: StatusSyncEnum;
    isPaused: boolean;
    currentUpdated: string;
    lastUploadedRevisionId: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  habilitationIsValid?: boolean;
};
