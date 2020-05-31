import * as Neo4j from 'neo4j-driver';
export declare class SongsService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getSong(id: number): Promise<{
        id: any;
        name: any;
        views: any;
        songUrl: any;
    }>;
}
