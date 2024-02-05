import { PerimeterType } from "./api-depot";

export enum RevisionStatusMoissoneurEnum {
  PROVIDED_BY_OTHER_CLIENT = "provided-by-other-client",
  PROVIDED_BY_OTHER_SOURCE = "provided-by-other-source",
  PUBLISHED = "published",
  ERROR = "error",
}

export enum UpdateStatusEnum {
  UNCHANGED = "unchanged",
  REJECTED = "rejected",
  UPDATED = "updated",
}

export enum HarvestStatus {
  FAILED = "failed",
  COMPLETED = "completed",
  ACTIVE = "active",
}

export type HarvestMoissonneurType = {
  _id: string;
  startedAt: Date;
  finishedAt: Date;
  status: HarvestStatus;
  error: string;
  updateStatus: UpdateStatusEnum;
  updateRejectionReason: string;
  fileId: string;
}

export type SourceMoissoneurType = {
  _id: string;
  _updated: string;
  _created: string;
  _deleted: boolean;
  url: string;
  title: string;
  type: string;
  page: string;
  organization: {
    id: string;
    name: string;
  };
  model: string;
  license: string;
  harvesting: {
    asked: boolean;
    lastHarvest: string;
    lastHarvestStatus: string;
    lastHarvestError: string;
  };
  enabled: boolean;
  description: string;
  data: {
    fileId: string;
    harvestDate: string;
    nbRows: number;
    nbRowsWithErrors: number;
    uniqueErrors: string[];
  };
};

export type PublicationMoissoneurType = {
  status: RevisionStatusMoissoneurEnum;
  publishedRevisionId?: string | undefined;
  errorMessage?: string;
  currentClientId?: string;
  currentSourceId?: string;
};

export type RevisionMoissoneurType = {
  _id: string;
  sourceId?: string;
  codeCommune?: string;
  harvestId?: string;
  updateStatus?: UpdateStatusEnum;
  updateRejectionReason?: string | undefined;
  fileId?: string;
  dataHash?: string;
  nbRows?: number;
  nbRowsWithErrors?: number;
  uniqueErrors?: string[];
  publication?: PublicationMoissoneurType;
  current?: boolean;
};


export type OrganizationMoissoneurType = {
  _id: string;
  name?: string;
  page?: string;
  logo?: string;
  isActive?: boolean;
  perimeters?: PerimeterType[];
  _updated?: Date;
  _created?: Date;
  _deleted?: boolean;
};