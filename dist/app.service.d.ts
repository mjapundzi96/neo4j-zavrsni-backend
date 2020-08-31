import { Genre, Song, Album } from './models';
import { Neo4jService } from './neo4j/neo4j.service';
import { Artist } from './models/artist.model';
import { SearchAllFilterDto } from './search-all-filter.dto';
export declare class AppService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getHello(): Promise<string>;
    getMyFavoriteGenres(user_id: number): Promise<Genre[]>;
    searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<Array<Partial<Artist | Song | Album>>>;
}
