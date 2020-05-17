import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';

@Injectable()
export class ArtistsService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }
    async getFavoriteArtists(user_id:number) {
        const genre_results = (await this.neo4j.session().run(`Match (n:Genre) return n;`)).records
        let genres = []
        genre_results.forEach((res) => {
            genres.push({
                id: res["_fields"][0].identity.low,
                name: res["_fields"][0].properties.name
            })
        })
        return genres;
    }
}
