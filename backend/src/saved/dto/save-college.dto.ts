import { IsString } from 'class-validator';

export class SaveCollegeDto {
  @IsString()
  collegeId: string;
}
