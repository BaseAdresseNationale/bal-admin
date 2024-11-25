import { PartenaireDeLaCharte } from "../server/lib/partenaire-de-la-charte/entity";
import { PerimeterType } from "./api-depot";

export type PageHarvests = {
  offset: number;
  limit: number;
  count: number;
  results: HarvestMoissonneurType[];
};

export enum RevisionStatusMoissoneurEnum {
  PROVIDED_BY_OTHER_CLIENT = "provided-by-other-client",
  PROVIDED_BY_OTHER_SOURCE = "provided-by-other-source",
  NOT_CONFIGURED = "not-configured",
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
  id: string;
  sourceId: string;
  fileId: string;
  fileHash: string;
  dataHash: string;
  status: HarvestStatus;
  updateStatus: UpdateStatusEnum;
  updateRejectionReason: string;
  error: string;
  startedAt: Date;
  finishedAt: Date;
};

export type SourceMoissoneurType = {
  id: string;
  organizationId: string;
  title: string;
  url: string;
  license: string;
  enabled: boolean;
  description: string;
  lastHarvest: Date;
  harvestingSince: Date | null;
  updatedAt?: Date;
  createdAt?: Date;
  deletedAt?: Date;
};

export interface ExtendedSourceMoissoneurType extends SourceMoissoneurType {
  harvestError?: boolean;
  nbRevisionError?: number;
}

export type PublicationMoissoneurType = {
  status: RevisionStatusMoissoneurEnum;
  publishedRevisionId?: string | undefined;
  errorMessage?: string;
  currentClientId?: string;
  currentSourceId?: string;
};

export type ValidationMoissonneurType = {
  nbRows?: number;
  nbRowsWithErrors?: number;
  uniqueErrors?: string[];
};

export type RevisionMoissoneurType = {
  id: string;
  sourceId?: string;
  harvestId?: string;
  fileId?: string;
  dataHash?: string;
  codeCommune?: string;
  updateStatus?: UpdateStatusEnum;
  updateRejectionReason?: string | undefined;
  validation?: ValidationMoissonneurType;
  publication?: PublicationMoissoneurType;
  createdAt?: Date;
};

export interface OrganizationMoissoneurType {
  id?: string;
  email?: string;
  name?: string;
  page?: string;
  logo?: string;
  perimeters?: PerimeterType[];
  updatedAt?: Date;
  createdAt?: Date;
  deletedAt?: Date;
}

export interface OrganizationBalAdminType extends OrganizationMoissoneurType {
  partenaire?: PartenaireDeLaCharte;
}
