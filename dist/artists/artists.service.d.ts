import { Neo4jService } from 'src/neo4j/neo4j.service';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
export declare class ArtistsService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getArtists(filterDto: GetArtistsFilterDto): Promise<any[]>;
    getArtist(id: number): Promise<any>;
}
