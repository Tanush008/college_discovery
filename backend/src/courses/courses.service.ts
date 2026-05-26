import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    dto: CreateCourseDto,
  ) {
    const college =
      await this.prisma.college.findUnique({
        where: {
          id: dto.collegeId,
        },
      });

    if (!college) {
      throw new NotFoundException(
        'College not found',
      );
    }

    return this.prisma.course.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        college: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        college: true,
      },
    });
  }

  async getCollegeCourses(
    collegeId: string,
  ) {
    return this.prisma.course.findMany({
      where: {
        collegeId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.course.delete({
      where: {
        id,
      },
    });
  }
}