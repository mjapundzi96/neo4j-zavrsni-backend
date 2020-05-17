import * as Neo4j from 'neo4j-driver';
export declare class GenresService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getGenres(): Promise<any[]>;
    getGenre(id: number): Promise<{
        id: any;
        name: any;
    }>;
}
