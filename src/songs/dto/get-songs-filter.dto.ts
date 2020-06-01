import { IsOptional } from "class-validator";

export class GetSongsFilterDto {
    @IsOptional()
    title: string;
}