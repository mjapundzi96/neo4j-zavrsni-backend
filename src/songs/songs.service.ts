import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { Neo4jService } from './../neo4j/neo4j.service'
import { Song } from 'src/models';

@Injectable()
export class SongsService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }
    async getSongs(filterDto: GetSongsFilterDto): Promise<Song[]> {
        const { title } = filterDto;
        const songs_results = await this.neo4j.query(`MATCH (n:Song) WHERE toUpper(n.title) CONTAINS toUpper('${title}') RETURN {
            id: ID(n),
            title:n.title,
            songUrl:n.songUrl,
            views:n.views
        } AS song;`)
        const songs = songs_results.map(result => {
            const songObj = result.get('song');
            return {
                ...songObj,
                id: songObj.id.low,
                views: songObj.views.low
            }
        })
        return songs;
    }

    async getSong(id: number): Promise<Song> {
        const song_result = await this.neo4j.query(`MATCH (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE ID(s)=${id} 
        RETURN s AS song, al AS album, ar AS artist;`)
        const songObj = song_result[0].get('song');
        const artistObj = song_result[0].get('artist');
        const albumObj = song_result[0].get('album');
        if (songObj) {
            return {
                ...songObj.properties,
                id: songObj.identity.low,
                views: songObj.properties.views.low,
                album: {
                    ...albumObj.properties,
                    id: albumObj.identity.low,
                    year: albumObj.properties.year.low,
                    artist: {
                        ...artistObj.properties,
                        id: artistObj.identity.low,
                    }
                }
            }
        }
        else throw new NotFoundException('Song not found');
    }

    async getUsersAlsoViewed(id: number, user_id: number): Promise<Song[]> {
        const song_results = await this.neo4j.query(`MATCH (s:Song)<-[:HAS_VIEWED]-(u:User)-[:HAS_VIEWED]->(rec:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        WHERE ID(u)<>${user_id} AND ID(s)=${id} AND NOT EXISTS((u)-[:HAS_VIEWED]-(rec))
        RETURN rec AS song,ar AS artist,al AS album,COUNT(*) AS usersWhoAlsoViewed
        ORDER BY usersWhoAlsoViewed DESC LIMIT 25`)
        const songs = song_results.map(result=>{
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            return {
                ...songObj.properties,
                id: songObj.identity.low,
                views: songObj.properties.views.low,
                album: {
                    ...albumObj.properties,
                    id: albumObj.identity.low,
                    year:albumObj.properties.low,
                    artist: {
                        ...artistObj.properties,
                        id: artistObj.identity.low,
                    }
                }
            }
        })
           
        return songs;
    }

    async viewSong(id: number, user_id: number): Promise<boolean> {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        MERGE (u)-[r:HAS_VIEWED]->(s)
        ON CREATE SET s.views = s.views + 1
        SET r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`)
        if (result[0].get('result')) {
            return true;
        }
        else throw new NotFoundException('User or song does not exist');
    }
}
