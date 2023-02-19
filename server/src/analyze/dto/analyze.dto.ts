import { IsEmpty, IsEnum, IsNotEmpty, IsUrl } from "class-validator";

export enum SourceType {
    GitHub = "GitHub"
}

export class AnalyzeDto {
  @IsNotEmpty()
  @IsEnum(SourceType)
  SourceType: SourceType;

  @IsNotEmpty()
  @IsUrl()
  Link: string;
}
