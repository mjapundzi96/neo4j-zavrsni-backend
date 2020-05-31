import { ArtistsService } from './artists.service';
export declare class ArtistsController {
    private artistsService;
    constructor(artistsService: ArtistsService);
    getArtist(id: number): Promise<{
        id: any;
        name: any;
        country: any;
        type: any;
        imageUrl: any;
        albums: any[];
    }>;
}
