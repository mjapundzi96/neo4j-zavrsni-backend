import { Neo4jService } from './../neo4j/neo4j.service';
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
import { User } from './../models/user.model';
import { Song, Album } from 'src/models';
export declare class UsersService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getUser(id: number): Promise<User>;
    getListenHistory(user_id: number): Promise<Song[]>;
    getRecommendendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<Album[]>;
    getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
}
