import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedService {
    constructor(
        private prisma: PrismaService,
    ) { }
    async saveCollege(
        userId: string,
        collegeId: string,
    ) {
        return this.prisma.savedCollege.create({
            data: {
                userId,
                collegeId,
            },
        });
    }
    async getSaved(userId: string) {
        return this.prisma.savedCollege.findMany({
            where: {
                userId,
            },

            include: {
                college: true,
            },
        });
    }
}
