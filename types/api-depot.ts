
export enum RevisionStatusApiDepotEnum {
  PUBLISHED = 'published',
  PENDING = 'pending',
}

export enum ClientApiDepotAuthorizationStrategy {
  HABILITATION = 'habilitation',
  CHEF_DE_FILE = 'chef-de-file',
  INTERNAL = 'internal',
}

export type ClientApiDepot = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  active: boolean;
  authorizationStrategy: ClientApiDepotAuthorizationStrategy;
  mandataire: string;
  nom: string;
  token: string;
  chefDeFile: string;
  options: {
    relaxMode: boolean;
  };
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

export type ChefDeFileApiDepot = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  nom: string;
  email: string;
  perimetre: string[];
  signataireCharte: boolean;
}

export type MandataireApiDepot = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  email: string;
  nom: string;
}
