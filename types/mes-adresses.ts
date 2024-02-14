
export type BaseLocaleType = {
  _id: string;
  token?: string;
  nom?: string;
  status?: string;
  commune?: string;
  nbNumeros?: number;
  nbNumerosCertifies?: number;
  isAllCertified?: boolean;
  commentedNumeros?: any;
  enableComplement?: boolean;
  emails?: string[];
  sync?: any;
  _created?: string;
  _updated?: string;
  _deleted?: string;
  habilitationIsValid?: boolean;
}
