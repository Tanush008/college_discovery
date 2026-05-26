import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetCollegesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumberString()
  minFees?: string;

  @IsOptional()
  @IsNumberString()
  maxFees?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
