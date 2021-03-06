import { AppService } from './app.service';
import { Genre, Song } from './models';
import { SearchAllFilterDto } from './search-all-filter.dto';
import { Artist } from './models/artist.model';
import { MostPopularFilterDto } from './most-popular-filter.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<string>;
    getBestOfPreferredGenre(request: any): Promise<{
        genre: Genre;
        songs: Song[];
    }>;
    getBestOfPreferredArtist(request: any): Promise<{
        artist: Artist;
        songs: Song[];
    }>;
    getBestOfPreferredDecade(request: any): Promise<{
        decade: number;
        songs: Song[];
    }>;
    getMostPopularSongs(mostPopularFilterDto: MostPopularFilterDto): Promise<any[]>;
    searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<(Partial<Song> | Partial<Artist> | Partial<import("./models").Album>)[]>;
}
