import { UsersService } from './users.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(filterDto: GetUsersFilterDto): Promise<import("neo4j-driver/types/record").default[]>;
    getUser(id: number): Promise<{
        id: any;
        username: any;
    }>;
    getFavoriteArtists(user_id: number): Promise<any[]>;
}
