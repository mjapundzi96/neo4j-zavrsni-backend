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
        const song_result = (await this.neo4j.session().run(`Match (n:Song) Where ID(n)=${id} return n;`)).records[0];
        if (song_result) {

            const fields = song_result["_fields"][0];
            const song = {
                id: fields.identity.low,
                title: fields.properties.title,
                views: fields.properties.views.low,
                songUrl: fields.properties.songUrl,
            }

            return song;
        }
        else throw new NotFoundException('Song not found');
    }

    async viewSong(id: number, viewSongDto: ViewSongDto) {
        const { user_id } = viewSongDto;
        const song = await this.getSong(id);
        const query = (await this.neo4j.session().run(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:HAS_VIEWED{ date_time: datetime({timezone:'Europe/Zagreb'}) }]->(s)
        SET s.views = s.views + 1
        RETURN true`))
        if (query.records.length > 0){
            return true;
        }
        else throw new NotFoundException('User does not exist');
    }
}
