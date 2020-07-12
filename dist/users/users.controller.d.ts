import { UsersService } from './users.service';
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
import { Song, User } from 'src/models';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUser(id: number, request: any): Promise<User>;
    getListenHistory(user_id: number): Promise<Song[]>;
    getRecommendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<import("../models").Album[]>;
    getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<any[]>;
}
