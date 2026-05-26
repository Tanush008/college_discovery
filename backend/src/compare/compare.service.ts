import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompareService {
  constructor(private prisma: PrismaService) {}

  async compare(ids: string[]) {
    if (ids.length < 2) {
      throw new BadRequestException('At least 2 colleges are required');
    }

    if (ids.length > 3) {
      throw new BadRequestException('Maximum 3 colleges can be compared');
    }

    const colleges = await this.prisma.college.findMany({
      where: {
        id: {
          in: ids,
        },
      },

      include: {
        courses: true,

        reviews: true,

        cutoffs: true,
      },
    });

    return colleges.map((college) => ({
      id: college.id,

      name: college.name,

      location: college.location,

      fees: college.fees,

      rating: college.rating,

      averagePackage: college.avgPackage,

      highestPackage: college.highestPackage,

      totalCourses: college.courses.length,

      totalReviews: college.reviews.length,

      topCourses: college.courses.slice(0, 5).map((course) => course.name),

      popularCutoffs: college.cutoffs.slice(0, 3).map((cutoff) => ({
        course: cutoff.course,
        closingRank: cutoff.closingRank,
      })),
    }));
  }
}
