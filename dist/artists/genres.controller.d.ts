import { GenresService } from './genres.service';
export declare class GenresController {
    private genresService;
    constructor(genresService: GenresService);
    getGenres(): Promise<any[]>;
    getGenre(id: number): Promise<{
        id: any;
        name: any;
    }>;
}
