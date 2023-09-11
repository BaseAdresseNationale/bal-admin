
export enum RevisionStatusApiDepotEnum {
  PUBLISHED = 'published',
  PENDING = 'pending',
}

export enum ClientApiDepotAuthorizationStrategyEnum {
  HABILITATION = 'habilitation',
  CHEF_DE_FILE = 'chef-de-file',
  INTERNAL = 'internal',
}

export type ClientApiDepotType = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  active: boolean;
  authorizationStrategy: ClientApiDepotAuthorizationStrategyEnum;
  mandataire: string;
  nom: string;
  token: string;
  chefDeFile: string;
  options: {
    relaxMode: boolean;
  };
}

export type RevisionApiDepotType = {
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
  client?: ClientApiDepotType;
  status?: RevisionStatusApiDepotEnum;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  current?: boolean;
  habilitation?: any;
}

export type ChefDeFileApiDepotType = {
  _id: string;
  nom?: string;
  email?: string;
  perimetre?: string[];
  signataireCharte?: boolean;
  _createdAt?: string;
  _updatedAt?: string;
}

export type MandataireApiDepotType = {
  _id: string;
  email?: string;
  nom?: string;
  _createdAt?: string;
  _updatedAt?: string;
}
