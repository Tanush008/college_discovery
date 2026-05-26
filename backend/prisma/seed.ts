import { PrismaClient } from '@prisma/client';
import { colleges } from './seed-data/college';
import { engineeringCourses } from './seed-data/courseTemplates';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding colleges...');

    for (const college of colleges) {

        const createdCollege =
            await prisma.college.create({
                data: college,
            });

        const feeMultiplier =
            college.name.includes('IIT')
                ? 1
                : college.name.includes('BITS')
                    ? 2.2
                    : college.name.includes('IIIT')
                        ? 1.8
                        : 1.1;

        await prisma.course.createMany({
            data: engineeringCourses.map(course => ({
                ...course,
                fees: Math.round(
                    course.fees * feeMultiplier,
                ),
                collegeId: createdCollege.id,
            })),
        });
    }

    // console.log('Seeding completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });