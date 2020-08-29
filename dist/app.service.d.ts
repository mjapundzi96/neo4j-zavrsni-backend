import { Genre } from './models';
import { Neo4jService } from './neo4j/neo4j.service';
export declare class AppService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getHello(): Promise<string>;
    getMyFavoriteGenres(user_id: number): Promise<Genre[]>;
}
