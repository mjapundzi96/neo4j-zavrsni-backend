import * as Neo4j from 'neo4j-driver';
export declare class ArtistsService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getFavoriteArtists(user_id: number): Promise<any[]>;
}
