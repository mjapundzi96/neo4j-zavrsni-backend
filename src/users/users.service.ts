import { Injectable, Inject } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import * as Neo4j from 'neo4j-driver';

@Injectable()
export class UsersService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ){
    }
    async getUsers(filterDto: GetUsersFilterDto){
        const { username } = filterDto;
        let queryUser = "n:User";
        if (username){
            queryUser += " {username:$username}"
        }
        const users = (await this.neo4j.session().run(`MATCH (${queryUser}) RETURN n`, {username:username})).records
        return users;
    }
}
