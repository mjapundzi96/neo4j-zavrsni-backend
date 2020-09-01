import { Genre, Song, Album } from './models';
import { Neo4jService } from './neo4j/neo4j.service';
import { Artist } from './models/artist.model';
import { SearchAllFilterDto } from './search-all-filter.dto';
import { MostPopularFilterDto } from './most-popular-filter.dto';
export declare class AppService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getHello(): Promise<string>;
    getBestOfPreferredArtist(user_id: number): Promise<{
        artist: Artist;
        songs: Song[];
    }>;
    getBestOfPreferredGenre(user_id: number): Promise<{
        genre: Genre;
        songs: Song[];
    }>;
    getBestOfPreferredDecade(user_id: number): Promise<{
        decade: number;
        songs: Song[];
    }>;
    getMostPopularSongs(mostPopularFilterDto: MostPopularFilterDto): Promise<any[]>;
    searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<Array<Partial<Artist | Song | Album>>>;
}
