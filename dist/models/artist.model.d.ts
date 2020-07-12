import { Album } from "./album.model";
export declare class Artist {
    id: number;
    name: string;
    imageUrl?: string;
    type?: string;
    albums: Array<Album>;
}
