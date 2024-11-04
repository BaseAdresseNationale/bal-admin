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
  IsBoolean,
  IsObject,
} from "class-validator";
import { TagEventsEnum, TypeEventsEnum } from "./entity";

export class EventDTO {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsEnum(TypeEventsEnum)
  type: TypeEventsEnum;

  @IsString()
  target: string;

  @IsDate()
  date: Date;

  @IsEnum(TagEventsEnum, { each: true })
  tags: TagEventsEnum[];

  @IsBoolean()
  isOnlineOnly: boolean;

  @IsOptional()
  @IsObject()
  address: Object;

  @IsOptional()
  @IsString()
  href: string;

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
