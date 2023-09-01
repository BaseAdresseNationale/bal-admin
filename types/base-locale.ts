export type BaseLocaleType = {
  _id: string;
  token: string;
  nom: string;
  status: string;
  _created: string;
  _updated: string;
  commune: string;
  nbNumeros: number;
  nbNumerosCertifies: number;
  isAllCertified: boolean;
  commentedNumeros: any;
  _deleted?: string;
  enableComplement?: boolean;
  sync?: any;
}

