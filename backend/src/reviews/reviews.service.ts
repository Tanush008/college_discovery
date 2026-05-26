import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(
        dto: CreateReviewDto,
        userId: string,
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

        return this.prisma.review.create({
            data: {
                rating: dto.rating,
                comment: dto.comment,

                userId,
                collegeId: dto.collegeId,
            },
        });
    }

    async findAll() {
        return this.prisma.review.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                college: true,
            },
        });
    }

    async findByCollege(
        collegeId: string,
    ) {
        return this.prisma.review.findMany({
            where: {
                collegeId,
            },

            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        return this.prisma.review.delete({
            where: {
                id,
            },
        });
    }
}