import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CollegesModule } from './colleges/colleges.module';
import { PredictorModule } from './predictor/predictor.module';
import { CompareModule } from './compare/compare.module';
import { SavedModule } from './saved/saved.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CutOffModule } from './cut-off/cut-off.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CollegesModule,
    PredictorModule,
    CompareModule,
    SavedModule,
    CoursesModule,
    ReviewsModule,
    CutOffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
