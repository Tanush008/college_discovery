import {
    IsString,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class CreateCollegeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    location: string;

    @IsNumber()
    fees: number;

    @IsNumber()
    rating: number;

    @IsString()
    overview: string;

    @IsNumber()
    avgPackage: number;

    @IsNumber()
    highestPackage: number;
}