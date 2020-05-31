import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';

@Injectable()
export class SongsService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }
    async getSong(id:number) {
        const song_result = (await this.neo4j.session().run(`Match (n:Song) Where ID(n)=${id} return n;`)).records[0];
        if (song_result){
            
            const fields = song_result["_fields"][0];
            const artist = {
                id:fields.identity.low,
                name:fields.properties.name,
                views:fields.properties.views.low,
                songUrl:fields.properties.songUrl,
            }
            
            return artist;
        }
        else throw new NotFoundException('Song not found');
    }
}
