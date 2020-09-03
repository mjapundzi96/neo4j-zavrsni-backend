import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import { Neo4jService } from './../neo4j/neo4j.service'
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
import { User } from './../models/user.model';
import { Song, Album } from 'src/models';

@Injectable()
export class UsersService {
    constructor(
        private readonly neo4j: Neo4jService
    ) {
    }

    async getUser(id: number): Promise<User> {
        const user_result = await this.neo4j.query(`MATCH (n:User) where ID(n)=${id} RETURN {
            id: ID(n),
            username: n.username
         } AS user;`);
        if (!user_result) {
            throw new NotFoundException('User not found');
        }
        return {
            ...user_result[0].get('user'),
            user_id: user_result[0].get('user').id.low
        }
    }

}
