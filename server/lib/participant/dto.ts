import { IsString, IsOptional, IsEmail, IsMongoId } from "class-validator";

export class ParticipantDTO {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  community: string;

  @IsOptional()
  @IsString()
  function: string;
}
