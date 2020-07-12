import { ArtistsService } from './artists.service';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
export declare class ArtistsController {
    private artistsService;
    constructor(artistsService: ArtistsService);
    getArtists(filterDto: GetArtistsFilterDto): Promise<void>;
    getArtist(id: number): Promise<void>;
}
