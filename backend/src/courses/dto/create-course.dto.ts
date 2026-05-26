import {
  IsString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  degree: string;

  @IsString()
  duration: string;

  @IsInt()
  fees: number;

  @IsString()
  collegeId: string;
}