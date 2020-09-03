import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Album } from 'src/models';
export declare class AlbumsService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getAlbum(id: number): Promise<Album>;
}
