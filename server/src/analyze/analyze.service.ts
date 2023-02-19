import { Injectable } from '@nestjs/common';
import { AnalyzeDto } from './dto/analyze.dto';

@Injectable()
export class AnalyzeService {
  analyzeFramework(analyzeDto: AnalyzeDto) {
    return analyzeDto;
  }
}
