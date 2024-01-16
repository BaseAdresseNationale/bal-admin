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

export type SourceMoissoneurType = {
  _id: string;
  _created: Date;
  _deleted: boolean;
  converter: any;
  data: any;
  description: string;
  enabled: boolean;
  harvesting: any;
  license: string;
  model: string;
  organization: any;
  page: string;
  title: string;
  type: string;
  url: string;
};
