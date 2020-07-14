import { ArtistsService } from './artists.service';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
import { Artist } from 'src/models/artist.model';
export declare class ArtistsController {
    private artistsService;
    constructor(artistsService: ArtistsService);
    getArtists(filterDto: GetArtistsFilterDto): Promise<Artist[]>;
    getArtist(id: number): Promise<Artist>;
}
