import { Injectable, Inject } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import * as Neo4j from 'neo4j-driver';

@Injectable()
export class UsersService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) {
    }
    async getUsers(filterDto: GetUsersFilterDto) {
        const { username } = filterDto;
        let queryUser = "n:User";
        if (username) {
            queryUser += " {username:$username}"
        }
        const users = (await this.neo4j.session().run(`MATCH (${queryUser}) RETURN n`, { username: username })).records
        return users;
    }

    async getUser(user_id){
        const userResult = (await this.neo4j.session().run(`MATCH (n:User) where ID(n)=${user_id}
        RETURN n;`)).records[0]
        if (userResult){
            const fields = userResult["_fields"][0]
            return {
                id: fields.identity.low,
                username: fields.properties.username,
            }
        }
    }

    async getFavoriteArtists(user_id: number) {
        let artists = [];
        const artistsResults = (await this.neo4j.session().run(`MATCH (n:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist) where ID(n)=${user_id}
        RETURN a;`)).records
        artistsResults.forEach(result => {
            const fields = result["_fields"][0];
            artists.push({
                id: fields.identity.low,
                name: fields.properties.name,
                type: fields.properties.type,
                country: fields.properties.country
            })
        })
        return artists
    }
}
