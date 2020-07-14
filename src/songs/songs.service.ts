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

        const song_result = (await this.neo4j.query(`Match (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist) Where ID(s)=${id} return {
            id: ID(s),
            title: s.title,
            views: s.views,
            songUrl: s.songUrl,
            album: {
                id: ID(al),
                name: al.name,
                coverUrl: al.coverUrl,
                artist: {
                    id: ID(ar),
                    name: ar.name,
                    imageUrl: ar.imageUrl
                }
            }
        } as song;`))
        const songObj = song_result[0].get('song');
        if (songObj){
            const album = songObj.album;
            const artist = album.artist;
            return {
                ...songObj,
                id: songObj.id.low,
                views: songObj.views.low,
                album:{
                    ...album,
                    id:album.id.low,
                    artist:{
                        ...artist,
                        id:artist.id.low,
                    }
                }
            }
        }
        else throw new NotFoundException('Song not found');
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
