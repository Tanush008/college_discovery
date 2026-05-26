import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCutoffDto } from './dto/create-cutoff.dto';

@Injectable()
export class CutoffService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(
        dto: CreateCutoffDto,
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

        return this.prisma.cutoff.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.cutoff.findMany({
            include: {
                college: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.cutoff.findUnique({
            where: {
                id,
            },

            include: {
                college: true,
            },
        });
    }

    async findByCollege(
        collegeId: string,
    ) {
        return this.prisma.cutoff.findMany({
            where: {
                collegeId,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.cutoff.delete({
            where: {
                id,
            },
        });
    }
}