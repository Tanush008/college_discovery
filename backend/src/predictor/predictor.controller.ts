import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { PredictorService } from './predictor.service';
import { PredictorDto } from './dto/predictor.dto';

@Controller('predictor')
export class PredictorController {

  constructor(
    private readonly predictorService:
      PredictorService,
  ) {}

  @Post()
  predict(
    @Body()
    dto: PredictorDto,
  ) {
    return this.predictorService.predict(
      dto,
    );
  }
}