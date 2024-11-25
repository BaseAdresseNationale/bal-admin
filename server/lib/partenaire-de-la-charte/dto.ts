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
  isEnum,
} from "class-validator";
import {
  PartenaireDeLaCharteTypeEnum,
  PartenaireDeLaCharteServiceEnum,
  PartenaireDeLaCharteOrganismeTypeEnum,
} from "./entity";

export class PartenaireDeLaCharteDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsBase64()
  picture: string;

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
  link: string;

  @IsOptional()
  @IsString()
  codeDepartement: string[];

  @IsOptional()
  @IsEnum(PartenaireDeLaCharteServiceEnum, { each: true })
  services: PartenaireDeLaCharteServiceEnum[];

  @IsOptional()
  @IsDate()
  signatureDate?: Date | string;

  @IsOptional()
  @IsMongoId({ each: true })
  dataGouvOrganizationId: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  apiDepotClientId: string[];

  // COMMUNE

  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.COMMUNE)
  @IsString()
  codeRegion: string;

  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.COMMUNE)
  @IsString()
  codeCommune: string;

  @ValidateIf(
    (o) =>
      o.type === PartenaireDeLaCharteTypeEnum.COMMUNE ||
      o.type === PartenaireDeLaCharteTypeEnum.ORGANISME
  )
  @IsOptional()
  @IsUrl()
  testimonyURL: string;

  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.COMMUNE)
  @IsOptional()
  @IsUrl()
  balURL: string;

  // ORGANISME
  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.ORGANISME)
  @IsEnum(PartenaireDeLaCharteOrganismeTypeEnum)
  organismeType: PartenaireDeLaCharteOrganismeTypeEnum;

  @ValidateIf(
    (o) =>
      o.type === PartenaireDeLaCharteTypeEnum.ORGANISME ||
      o.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE
  )
  @IsString()
  @IsOptional()
  infos: string;

  @ValidateIf(
    (o) =>
      o.type === PartenaireDeLaCharteTypeEnum.ORGANISME ||
      o.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE
  )
  @IsString()
  @IsOptional()
  perimeter: string;

  // ENTRPRISE
  @ValidateIf((o) => o.type === PartenaireDeLaCharteTypeEnum.ENTREPRISE)
  @IsString()
  @IsOptional()
  isPerimeterFrance: boolean;
}
