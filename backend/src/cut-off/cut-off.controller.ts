import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CutoffService } from './cut-off.service';
import { CreateCutoffDto } from './dto/create-cutoff.dto';

@Controller('cutoffs')
export class CutoffController {

  constructor(
    private readonly CutoffService:
      CutoffService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateCutoffDto,
  ) {
    return this.CutoffService.create(
      dto,
    );
  }

  @Get()
  findAll() {
    return this.CutoffService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.CutoffService.findOne(id);
  }

  @Get('college/:collegeId')
  findByCollege(
    @Param('collegeId')
    collegeId: string,
  ) {
    return this.CutoffService.findByCollege(
      collegeId,
    );
  }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.CutoffService.delete(id);
  }
}