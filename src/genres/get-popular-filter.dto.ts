import { IsNumberString } from "class-validator";

export class GetPopularFilterDto {
    @IsNumberString()
    limit: number;

    @IsNumberString()
    offset: number;
}