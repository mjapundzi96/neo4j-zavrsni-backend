import { GenresService } from './genres.service';
import { Genre, Album } from './../models';
import { GetPopularFilterDto } from './dto/get-popular-filter.dto';
export declare class GenresController {
    private genresService;
    constructor(genresService: GenresService);
    getGenres(): Promise<Genre[]>;
    getGenre(id: number): Promise<Genre>;
    getPopularAlbumsFromGenre(id: number, getPopularFilterDto: GetPopularFilterDto): Promise<Album[]>;
}
