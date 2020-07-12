import { Song } from "./song.model";

export class Album {
    id: number;
    name: string;
    coverUrl?: string;
    year?: number;
    songs?:Array<Song>;
}