import { IsEmpty, IsEnum, IsNotEmpty, IsUrl } from "class-validator";

export enum SourceType {
    GitHub = "GitHub"
}

export enum ProjectType {
  IOS = "iOS",
  DOTNET = ".NET",
  JAVA = "Java",
  FLUTTER = "FLUTTER"
}

export class AnalyzeDto {
  @IsNotEmpty()
  @IsEnum(SourceType)
  SourceType: SourceType;

  @IsNotEmpty()
  @IsEnum(ProjectType)
  ProjectType: ProjectType;

  @IsNotEmpty()
  @IsUrl()
  Link: string;
}
