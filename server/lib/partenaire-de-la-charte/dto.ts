import {
  IsEmail,
  IsMongoId,
  ValidateIf,
  IsString,
  IsBase64,
  IsOptional,
  IsEnum,
  IsUrl,
} from "class-validator";
import { TypePartenaireDeLaCharteEnum } from "./entity";

export class PartenaireDeLaCharteDTO {
  @IsMongoId()
  id?: string;

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

  @IsEnum(TypePartenaireDeLaCharteEnum)
  type: TypePartenaireDeLaCharteEnum;

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
  @IsString({ each: true })
  service: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  dataGouvOrganizationId: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  apiDepotClientId: string[];

  // COMMUNE

  @ValidateIf((o) => o.type === TypePartenaireDeLaCharteEnum.COMMUNE)
  @IsString()
  codeRegion: string;

  @ValidateIf((o) => o.type === TypePartenaireDeLaCharteEnum.COMMUNE)
  @IsString()
  codeCommune: string;

  @ValidateIf(
    (o) =>
      o.type === TypePartenaireDeLaCharteEnum.COMMUNE ||
      o.type === TypePartenaireDeLaCharteEnum.ORGANISME
  )
  @IsOptional()
  @IsUrl()
  testimonyURL: string;

  @ValidateIf((o) => o.type === TypePartenaireDeLaCharteEnum.COMMUNE)
  @IsOptional()
  @IsUrl()
  balURL: string;

  // ORGANISME
  @ValidateIf((o) => o.type === TypePartenaireDeLaCharteEnum.ORGANISME)
  @IsString()
  organismeType: string;

  @ValidateIf(
    (o) =>
      o.type === TypePartenaireDeLaCharteEnum.ORGANISME ||
      o.type === TypePartenaireDeLaCharteEnum.ENTREPRISE
  )
  @IsString()
  @IsOptional()
  infos: string;

  @ValidateIf(
    (o) =>
      o.type === TypePartenaireDeLaCharteEnum.ORGANISME ||
      o.type === TypePartenaireDeLaCharteEnum.ENTREPRISE
  )
  @IsString()
  @IsOptional()
  perimeter: string;

  // ENTRPRISE
  @ValidateIf((o) => o.type === TypePartenaireDeLaCharteEnum.ENTREPRISE)
  @IsString()
  @IsOptional()
  isPerimeterFrance: boolean;
}
