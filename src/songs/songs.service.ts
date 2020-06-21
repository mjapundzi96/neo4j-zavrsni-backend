import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { ViewSongDto } from './dto/view-song.dto';

@Injectable()
export class SongsService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }
    async getSongs(filterDto: GetSongsFilterDto) {
        const { title } = filterDto;
        const songs_results = (await this.neo4j.session().run(`Match (n:Song) Where toUpper(n.title) CONTAINS toUpper('${title}') return n;`)).records;
        let songs = [];
        songs_results.forEach(result => {
            const fields = result["_fields"][0];
            songs.push({
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                songUrl: fields.properties.songUrl,
            })
        })
        return songs;
    }

    async getSong(id: number) {

        const song_result = (await this.neo4j.session().run(`Match (s:Song)-[r:FROM_ALBUM]->(al:Album)-[r2:BY_ARTIST]->(ar:Artist) Where ID(s)=${id} return s,al,ar;`)).records[0];
        if (song_result) {

            const song_fields = song_result["_fields"][0];
            const album_fields = song_result["_fields"][1];
            const artist_fields = song_result["_fields"][2];
            const song = {
                id: song_fields.identity.low,
                title: song_fields.properties.title,
                views: song_fields.properties.views.low,
                songUrl: song_fields.properties.songUrl,
                album: {
                    id: album_fields.identity.low,
                    name: album_fields.properties.name,
                    coverUrl: album_fields.properties.coverUrl,
                    artist:{
                        id:artist_fields.identity.low,
                        name:artist_fields.properties.name,
                        
                    }
                }
            }

            return song;
        }
        else throw new NotFoundException('Song not found');
    }


    async viewSong(id: number, viewSongDto: ViewSongDto) {
        const { user_id } = viewSongDto;
        //remove previous listen history for song if exists
        (await this.neo4j.session().run(`match (u:User)-[r:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id} and ID(s)=${id} delete r;`))
        const query = (await this.neo4j.session().run(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:HAS_VIEWED{ date_time: datetime({timezone:'Europe/Zagreb'}) }]->(s)
        SET s.views = s.views + 1
        RETURN true`))
        if (query.records.length > 0) {
            return true;
        }
        else throw new NotFoundException('User does not exist');
    }
}
