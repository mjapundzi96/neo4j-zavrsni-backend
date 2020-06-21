import { Injectable, Inject } from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import * as Neo4j from 'neo4j-driver';
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';

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

    async getUser(user_id: number) {
        const userResult = (await this.neo4j.session().run(`MATCH (n:User) where ID(n)=${user_id}
        RETURN n;`)).records[0]
        if (userResult) {
            const fields = userResult["_fields"][0]
            return {
                id: fields.identity.low,
                username: fields.properties.username,
            }
        }
    }


    async getListenHistory(user_id: number) {
        const history_results = (await this.neo4j.session().run(`match (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} return s,r.date_time ORDER BY r.date_time DESC;`)).records
        let songs = [];
        history_results.forEach((result) => {
            const fields = result["_fields"][0];
            const date = result["_fields"][1]
            songs.push({
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                date_listened: new Date(
                    date.year.low, date.month.low, date.day.low, date.hour.low, date.minute.low, date.second.low
                )
            })
        })
        return songs;
    }

    async getRecommendendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        let albums = [];
        const albumsResults = (await this.neo4j.session().run(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN al,sum(s.views),a ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`)).records;
        albumsResults.forEach((result) => {
            const fields = result["_fields"][0];
            const views = result["_fields"][1].low
            const artist = result["_fields"][2]
            albums.push({
                id: fields.identity.low,
                name: fields.properties.name,
                coverUrl: fields.properties.coverUrl,
                year: fields.properties.year.low,
                views: views,
                artist: Object.assign(artist.properties, { id: artist.identity.low })
            })
        })
        return albums;
    }

    async getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto){
        const { offset, limit } = getRecommendedFilterDto;
        let artists = [];
        const artistsResults = (await this.neo4j.session().run(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN a,sum(s.views),g ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`)).records;
        artistsResults.forEach((result) => {
            const fields = result["_fields"][0];
            const views = result["_fields"][1].low
            const genre = result["_fields"][2]
            artists.push({
                id: fields.identity.low,
                name: fields.properties.name,
                imageUrl: fields.properties.imageUrl,
                country: fields.properties.country,
                type: fields.properties.type,
                views: views,
                genre: Object.assign(genre.properties, { id: genre.identity.low })
            })
        })
        return artists;
    }

}
