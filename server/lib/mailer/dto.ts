import { IsEmail, IsString, IsOptional, ValidateIf } from "class-validator";

export class MailDTO {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  message: string;

  @IsString()
  subject: string;

  @IsString()
  captchaToken: string;

  @ValidateIf(
    (o) =>
      o.subject === "Adresse non répertoriée" ||
      o.subject === "Voie non répertoriée"
  )
  @IsOptional()
  @IsString()
  city: string;

  @ValidateIf(
    (o) =>
      o.subject === "Adresse non répertoriée" ||
      o.subject === "Voie non répertoriée"
  )
  @IsString()
  street: string;

  @ValidateIf((o) => o.subject === "Adresse non répertoriée")
  @IsOptional()
  @IsString()
  number: string;
}
