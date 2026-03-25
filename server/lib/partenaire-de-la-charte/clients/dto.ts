import { ClientTypeEnum } from "./entity";
import { TypePerimeterEnum } from "./pertimeters/entity";

export type PerimeterDTO = {
  id?: string;
  type: TypePerimeterEnum;
  code: string;
};

export type ClientDTO = {
  clientId: string;
  name: string;
  type: ClientTypeEnum;
  perimeters?: PerimeterDTO[];
};
