import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
  IsObject,
} from "class-validator";
import { EventTypeEnum, EventTagEnum } from "./entity";

export class EventDTO {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @IsString()
  target: string;

  @IsDate()
  date: Date | string;

  @IsEnum(EventTagEnum, { each: true })
  tags: EventTagEnum[];

  @IsBoolean()
  isOnlineOnly: boolean;

  @IsOptional()
  @IsObject()
  address: {
    nom?: string;
    numero?: string;
    voie?: string;
    codePostal?: string;
    commune?: string;
  };

  @IsOptional()
  @IsString()
  href?: string;

  @IsBoolean()
  isSubscriptionClosed: boolean;

  @IsOptional()
  @IsString()
  instructions: string;

  @IsString()
  startHour: string;

  @IsString()
  endHour: string;
}
