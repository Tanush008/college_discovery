import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PredictorDto } from './dto/predictor.dto';

type PredictionResult = {
  collegeId: string;
  collegeName: string;
  location: string;
  course: string;
  closingRank: number;
};

@Injectable()
export class PredictorService {
  constructor(private prisma: PrismaService) {}

  async predict(dto: PredictorDto) {
    const cutoffs = await this.prisma.cutoff.findMany({
      where: {
        exam: dto.exam,
        category: dto.category,
      },
      include: {
        college: true,
      },
    });

    const safe: PredictionResult[] = [];
    const moderate: PredictionResult[] = [];
    const dream: PredictionResult[] = [];

    for (const cutoff of cutoffs) {
      const closingRank = cutoff.closingRank;

      if (dto.rank <= closingRank * 0.7) {
        safe.push({
          collegeId: cutoff.college.id,
          collegeName: cutoff.college.name,
          location: cutoff.college.location,
          course: cutoff.course,
          closingRank,
        });
      } else if (dto.rank <= closingRank) {
        moderate.push({
          collegeId: cutoff.college.id,
          collegeName: cutoff.college.name,
          location: cutoff.college.location,
          course: cutoff.course,
          closingRank,
        });
      } else if (dto.rank <= closingRank * 1.15) {
        dream.push({
          collegeId: cutoff.college.id,
          collegeName: cutoff.college.name,
          location: cutoff.college.location,
          course: cutoff.course,
          closingRank,
        });
      }
    }

    return {
      safe,
      moderate,
      dream,
    };
  }
}
