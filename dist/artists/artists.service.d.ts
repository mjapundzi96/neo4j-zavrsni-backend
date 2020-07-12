import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
export declare class ArtistsService {
    constructor();
    getArtists(filterDto: GetArtistsFilterDto): Promise<void>;
    getArtist(id: number): Promise<void>;
}
