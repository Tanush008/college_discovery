import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';

import { CollegesService } from './colleges.service';
import { GetCollegesDto } from './dto/get-colleges.dto';
import { Post, Body } from '@nestjs/common';
import { CreateCollegeDto } from './dto/create-college.dto';
import { Param } from '@nestjs/common';
@Controller('colleges')
export class CollegesController {
    constructor(
        private readonly collegesService: CollegesService,
    ) { }

    @Get()
    getAll(
        @Query() query: GetCollegesDto,
    ) {
        return this.collegesService.findAll(
            query,
        );
    }
    @Post()
    createCollege(
        @Body() dto: CreateCollegeDto,
    ) {
        return this.collegesService.create(dto);
    }
    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {
        return this.collegesService.findOne(id);
    }


}
