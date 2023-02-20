import { Controller, Post, Body, UsePipes, HttpCode } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './dto/analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('framework')
  @HttpCode(200)
  create(@Body() analyzeDto: AnalyzeDto) {
    return this.analyzeService.analyzeFramework(analyzeDto);
  }
}
