import { ArtistsService } from './artists.service';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
export declare class ArtistsController {
    private artistsService;
    constructor(artistsService: ArtistsService);
    getArtists(filterDto: GetArtistsFilterDto): Promise<any[]>;
    getArtist(id: number): Promise<{
        id: any;
        name: any;
        country: any;
        type: any;
        imageUrl: any;
        albums: any[];
    }>;
}
