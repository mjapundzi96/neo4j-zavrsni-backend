import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import * as Neo4j from 'neo4j-driver';
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
export declare class UsersService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getUsers(filterDto: GetUsersFilterDto): Promise<Neo4j.Record[]>;
    getUser(user_id: number): Promise<{
        id: any;
        username: any;
    }>;
    getListenHistory(user_id: number): Promise<any[]>;
    getRecommendendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
    getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
}
