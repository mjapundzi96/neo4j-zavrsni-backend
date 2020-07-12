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
            id: user_result[0].get('user').id.low
        }
    }


    async getListenHistory(user_id: number): Promise<Song[]> {
        const history_results = await this.neo4j.query(`MATCH (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} RETURN {
            id:ID(s),
            title:s.title,
            views:s.views,
            songUrl:s.songUrl,
            date_listened:r.date_time
        } AS song ORDER BY r.date_time DESC;`)
        let songs = []
        history_results.forEach((result) => {
            const songObj = result.get('song');
            const date = songObj.date_listened;
            songs.push({
                id: songObj.id.low,
                title: songObj.title,
                views: songObj.views.low,
                songUrl: songObj.songUrl,
                date_listened: new Date(
                    date.year.low, date.month.low, date.day.low, date.hour.low, date.minute.low, date.second.low
                )
            })
        })
        return songs;
    }

    async getRecommendendedAlbums(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto): Promise<Album[]> {
        const { offset, limit } = getRecommendedFilterDto;
        
        const albumsResults = await this.neo4j.query(`MATCH (u:User)-[:HAS_FAVORITE_GENRE]->(:Genre)<-[:IS_GENRE]-(ar:Artist)<-[:BY_ARTIST]-(al:Album)<-[:FROM_ALBUM]-(s:Song) where ID(u)=${user_id}
         WITH al,ar,s,sum(s.views) as views
         RETURN {
             id:ID(al),
             name:al.name,
             coverUrl:al.coverUrl,
             year:al.year,
             artist:{
                 id:ID(ar),
                 name:ar.name,
                 imageUrl:ar.imageUrl,
                 country:ar.country
             }
         } AS album ORDER BY views DESC SKIP ${offset} LIMIT ${limit};`);
        let albums = [];
        albumsResults.forEach((result) => {
            const albumObj = result.get('album');
            albums.push({
                ...albumObj,
                id: albumObj.id.low,
                year: albumObj.year.low,
                artist: {
                    ...albumObj.artist,
                    id: albumObj.artist.id.low
                }
            } as Album)
        })
        return albums;
    }

    async getRecommendedArtists(user_id: number, getRecommendedFilterDto: GetRecommendedFilterDto) {
        const { offset, limit } = getRecommendedFilterDto;
        
        const artistsResults = await this.neo4j.query(`MATCH (u:User)-[r:HAS_FAVORITE_GENRE]->(g:Genre)<-[r2:IS_GENRE]-(a:Artist)<-[r3:BY_ARTIST]-(al:Album)<-[r4:FROM_ALBUM]-(s:Song)
        where ID(u)=${user_id} RETURN a,sum(s.views),g ORDER BY sum(s.views) DESC SKIP ${offset} LIMIT ${limit};`);
        let artists = [];
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
