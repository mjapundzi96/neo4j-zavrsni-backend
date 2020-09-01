import { IsString } from "class-validator";

export class SearchAllFilterDto {
    @IsString()
    search: string;
}