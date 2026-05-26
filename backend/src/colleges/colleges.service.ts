import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetCollegesDto } from './dto/get-colleges.dto';
import { CreateCollegeDto } from './dto/create-college.dto';
@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetCollegesDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const colleges = await this.prisma.college.findMany({
      where: {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },

        location: query.location,

        fees: {
          gte: query.minFees ? Number(query.minFees) : undefined,

          lte: query.maxFees ? Number(query.maxFees) : undefined,
        },
      },

      skip: (page - 1) * limit,
      take: limit,
    });

    return colleges;
  }

  async create(dto: CreateCollegeDto) {
    return this.prisma.college.create({
      data: dto,
    });
  }

  async findOne(id: string) {
    return this.prisma.college.findUnique({
      where: { id },

      include: {
        courses: true,

        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },

        cutoffs: true,
      },
    });
  }
}
