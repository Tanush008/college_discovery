import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateReviewDto,

    @Req()
    req: Request & {
      user: any;
    },
  ) {
    return this.reviewsService.create(dto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('college/:collegeId')
  findByCollege(
    @Param('collegeId')
    collegeId: string,
  ) {
    return this.reviewsService.findByCollege(collegeId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
