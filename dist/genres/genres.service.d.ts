import { Genre, Album } from './../models';
import { Neo4jService } from './../neo4j/neo4j.service';
import { GetPopularFilterDto } from './dto/get-popular-filter.dto';
export declare class GenresService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getGenres(): Promise<Genre[]>;
    getGenre(id: number): Promise<Genre>;
    getPopularAlbumsFromGenre(id: number, getPopularFilterDto: GetPopularFilterDto): Promise<Album[]>;
}
