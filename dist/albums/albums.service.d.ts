import * as Neo4j from 'neo4j-driver';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
export declare class AlbumsService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getAlbums(filterDto: GetAlbumsFilterDto): Promise<any[]>;
    getAlbum(id: number): Promise<{
        id: any;
        name: any;
        year: any;
        coverUrl: any;
        songs: any[];
    }>;
}
