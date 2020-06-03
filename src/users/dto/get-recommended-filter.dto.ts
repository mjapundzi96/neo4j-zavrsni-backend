import { IsNumberString } from "class-validator";

export class GetRecommendedFilterDto {
    @IsNumberString()
    limit: number;

    @IsNumberString()
    offset: number;
}