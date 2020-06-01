import { IsInt } from "class-validator";

export class ViewSongDto {
    @IsInt()
    user_id: number
}