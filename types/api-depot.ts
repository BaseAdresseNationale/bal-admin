
export enum RevisionStatusApiDepotEnum {
  PUBLISHED = 'published',
  PENDING = 'pending',
}

export type ClientApiDepot = {
  _id: string;
  chefDeFile: string;
  mandataire: string;
  nom: string;
}

export type RevisionApiDepot = {
  _id: string;
  codeCommune?: string;
  context?: any;
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
    infos: string[];
    rowsCount: number;
  };
  client?: ClientApiDepot;
  status?: RevisionStatusApiDepotEnum;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  current?: boolean;
  habilitation?: any;
}
