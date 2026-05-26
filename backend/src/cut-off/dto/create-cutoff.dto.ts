import {
    IsString,
    IsInt,
    Min,
} from 'class-validator';

export class CreateCutoffDto {

    @IsString()
    exam: string;

    @IsString()
    category: string;

    @IsString()
    course: string;

    @IsInt()
    @Min(1)
    openingRank: number;

    @IsInt()
    @Min(1)
    closingRank: number;

    @IsString()
    collegeId: string;
}