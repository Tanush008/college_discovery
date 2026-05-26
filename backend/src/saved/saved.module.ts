import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SavedController],
  providers: [SavedService,
    PrismaService
  ]
})
export class SavedModule { }
