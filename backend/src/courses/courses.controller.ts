import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService:
            CoursesService,
    ) { }

    @Post()
    create(
        @Body() dto: CreateCourseDto,
    ) {
        return this.coursesService.create(
            dto,
        );
    }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {
        return this.coursesService.findOne(id);
    }

    @Get('college/:collegeId')
    getCollegeCourses(
        @Param('collegeId')
        collegeId: string,
    ) {
        return this.coursesService.getCollegeCourses(
            collegeId,
        );
    }

    @Delete(':id')
    delete(
        @Param('id') id: string,
    ) {
        return this.coursesService.delete(id);
    }
}