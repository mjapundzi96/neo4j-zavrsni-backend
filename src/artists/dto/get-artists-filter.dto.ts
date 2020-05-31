import { IsOptional } from "class-validator";

export class GetArtistsFilterDto {
    @IsOptional()
    name: string;
}