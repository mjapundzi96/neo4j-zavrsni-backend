import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Album } from 'src/models';
export declare class AlbumsService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getAlbums(filterDto: GetAlbumsFilterDto): Promise<Album[]>;
    getAlbum(id: number): Promise<Album>;
}
