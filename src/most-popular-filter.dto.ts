import { IsString } from "class-validator";

export class MostPopularFilterDto {
    @IsString()
    period: 'week' | 'month' | 'alltime';
}