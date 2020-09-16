import { UsersService } from './users.service';
import { User } from 'src/models';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUser(id: number): Promise<User>;
}
