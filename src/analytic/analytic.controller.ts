import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AnalyticService } from './analytic.service';

@ApiBearerAuth()
@Controller('analytic')
@UseGuards(JwtAuthGuard)
export class AnalyticController {
  constructor(private readonly analyticService: AnalyticService) {}

  @Get()
  getAll() {
    return this.analyticService.getAnalytic();
  }
}
