import { Album } from "./album.model";

export class Artist {
    id: number;
    name: string;
    imageUrl?: string;
    type?: string;
    albums: Array<Album>;
}