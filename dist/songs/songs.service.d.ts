import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { Neo4jService } from './../neo4j/neo4j.service';
export declare class SongsService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getSongs(filterDto: GetSongsFilterDto): Promise<void>;
    getSong(id: number): Promise<void>;
    viewSong(id: number, user_id: number): Promise<boolean>;
}
