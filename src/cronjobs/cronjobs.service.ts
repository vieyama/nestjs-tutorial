import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronjobsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(CronjobsService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateStayByStatus() {
    this.logger.log('Update stay.....');
    await this.prismaService.serviceInvoices.updateMany({
      where: {
        status: {
          not: 'DONE',
        },
      },
      data: {
        stay: true,
      },
    });
  }
}
