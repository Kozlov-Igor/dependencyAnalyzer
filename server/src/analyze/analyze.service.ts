import { BadRequestException, Injectable } from '@nestjs/common';
import * as request from 'request';
import { AnalyzeDto, ProjectType } from './dto/analyze.dto';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import * as rimraf from 'rimraf';
import * as path from 'path';

export const projectFileExtension = {
  [ProjectType.IOS]: ['.pbxproj'],
};

export type IOSProjectConfig = {
  compatibilityVersion: string;
};

export type ProjectConfig = IOSProjectConfig;

@Injectable()
export class AnalyzeService {
  async analyzeFramework(analyzeDto: AnalyzeDto) {
    if (!projectFileExtension[analyzeDto.ProjectType])
      throw new BadRequestException('This type of project is not supported.');
    const requestPromise = new Promise((res, rej) =>
      request(analyzeDto.Link)
        .pipe(fs.createWriteStream('repo.zip'))
        .on('close', async () => {
          const zip = new AdmZip('repo.zip');
          zip.extractAllTo('project');
          const configurationFilePath = this.checkConfigurationFile(
            analyzeDto.ProjectType,
            'project',
          );
          const config = this.checkProjectByType(
            analyzeDto.ProjectType,
            configurationFilePath,
          );
          fs.unlinkSync('repo.zip');
          rimraf.sync('project');
          res(config);
        }),
    );
    return requestPromise;
  }

  checkConfigurationFile(projectType: ProjectType, directory: string): string {
    const files = fs.readdirSync(directory);
    for (let file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const foundPath = this.checkConfigurationFile(projectType, filePath);
        if (foundPath) {
          return foundPath;
        }
      } else if (
        projectFileExtension[projectType].includes(path.extname(file))
      ) {
        return filePath;
      }
    }
    return null;
  }

  checkProjectByType(
    projectType: ProjectType,
    projectPath: string,
  ): ProjectConfig {
    switch (projectType) {
      case ProjectType.IOS:
        return this.checkIOSProject(projectPath);
      default:
        return;
    }
  }

  /* Check for iOS project files **/
  checkIOSProject(projectPath: string): ProjectConfig {
    if (fs.existsSync(projectPath)) {
      const configFile = fs.readFileSync(projectPath, 'utf8');
      const match = configFile.match(
        /compatibilityVersion = "Xcode\s\d+\.\d+"/,
      );
      const xCodeVersion = match[0]?.split('=')[1]?.trim().replace(/"/g, '');
      return { compatibilityVersion: xCodeVersion };
    }
  }
}
