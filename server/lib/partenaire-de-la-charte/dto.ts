import {
  IsEmail,
  IsMongoId,
  ValidateIf,
  IsString,
  IsBase64,
  IsOptional,
  IsEnum,
  IsUrl,
  IsDate,
  IsArray,
} from "class-validator";
import {
  PartenaireDeLaCharteTypeEnum,
  PartenaireDeLaCharteServiceEnum,
  PartenaireDeLaCharteOrganismeTypeEnum,
} from "./entity";
import { Client } from "./clients/entity";

export interface PartenaireDeLaCharteQuery {
  codeDepartement?: string;
  search?: string;
  withoutPictures?: boolean;
  shuffleResults?: boolean;
  services?:
    | PartenaireDeLaCharteServiceEnum
    | PartenaireDeLaCharteServiceEnum[];
  type?: PartenaireDeLaCharteTypeEnum;
  withCandidates?: boolean;
  dataGouvOrganizationId?: string | string[];
  apiDepotClientId?: string | string[];
}

export class PartenaireDeLaCharteDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsBase64()
  picture?: string;

  @IsString()
  contactLastName: string;

  @IsString()
  contactFirstName: string;

  @IsEmail()
  contactEmail: string;

  @IsEnum(PartenaireDeLaCharteTypeEnum)
  type: PartenaireDeLaCharteTypeEnum;

  @IsOptional()
  @IsUrl()
  charteURL: string;

  @IsOptional()
  @IsUrl()
  webSiteURL: string;

  @IsOptional()
  @IsString()
  coverDepartement: string[];

  @IsOptional()
  @IsEnum(PartenaireDeLaCharteServiceEnum, { each: true })
  services: PartenaireDeLaCharteServiceEnum[];

  @IsOptional()
  @IsDate()
  charteSignatureDate?: Date | string;

  @IsOptional()
  @IsArray()
  clients?: Client[];

  // COMMUNE

  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.COMMUNE)
  @IsString()
  communeCodeInsee: string;

  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.COMMUNE)
  @IsOptional()
  @IsUrl()
  communeBalURL: string;

  // ORGANISME
  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.ORGANISME)
  @IsEnum(PartenaireDeLaCharteOrganismeTypeEnum)
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum;

  @ValidateIf(
    (o) =>
      o.type === PartenaireDeLaCharteTypeEnum.ORGANISME ||
      o.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE,
  )
  @IsString()
  @IsOptional()
  organismeInfo: string;

  // ENTRPRISE
  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE)
  @IsString()
  @IsOptional()
  entrepriseIsPerimeterFrance: boolean;
}
