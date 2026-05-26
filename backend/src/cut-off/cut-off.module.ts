import { Module } from '@nestjs/common';
import { CutoffController } from './cut-off.controller';
import { CutoffService } from './cut-off.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  controllers: [CutoffController],
  providers: [CutoffService, PrismaService],
})
export class CutOffModule {}
