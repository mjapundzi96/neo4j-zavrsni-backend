import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';

@Injectable()
export class GenresService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }
    async getGenres() {
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

    async getGenre(id: number) {
        const genre_result = (await this.neo4j.session().run(`match (n:Genre) where ID(n)=${id} return n;`)).records[0]
        if (genre_result) {
            const genre = {
                id: genre_result["_fields"][0].identity.low,
                name: genre_result["_fields"][0].properties.name
            }
            return genre;
        }
        else throw new NotFoundException('Genre does not exist')
    }
}
