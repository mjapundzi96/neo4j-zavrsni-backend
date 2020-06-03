import { UsersService } from './users.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(filterDto: GetUsersFilterDto): Promise<import("neo4j-driver/types/record").default[]>;
    getUser(id: number): Promise<{
        id: any;
        username: any;
    }>;
    getListenHistory(user_id: number): Promise<any[]>;
    getRecommendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
    getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
}
