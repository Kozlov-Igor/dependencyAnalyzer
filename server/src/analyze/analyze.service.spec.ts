import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeService } from './analyze.service';
import * as path from 'path';

describe('AnalyzeService', () => {
  let service: AnalyzeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzeService],
    }).compile();

    service = module.get<AnalyzeService>(AnalyzeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return correct version in response', () => {
    expect(
      service.checkIOSProject(
        path.join(
          __dirname,
          '..',
          '..',
          'test-files',
          'project.pbxproj',
        ),
      ),
    ).toEqual({
      compatibilityVersion: 'Xcode 14.0',
    });
  });
});
