import { IsString, IsOptional, IsEmail, IsMongoId } from "class-validator";
import { Stats } from "./entity";

export class StatsDTO implements Stats {
  @IsString()
  name: string;

  @IsEmail()
  value: Object;
}
