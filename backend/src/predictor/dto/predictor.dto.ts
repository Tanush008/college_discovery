import { IsString, IsInt, Min } from 'class-validator';

export class PredictorDto {
  @IsString()
  exam: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(1)
  rank: number;
}
