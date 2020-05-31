import { IsOptional } from "class-validator";

export class GetAlbumsFilterDto {
    @IsOptional()
    name: string;
}