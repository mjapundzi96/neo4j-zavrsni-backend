import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';

@Injectable()
export class ArtistsService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }
    async getArtists(filterDto:GetArtistsFilterDto) {
        const { name } = filterDto;
        const artists_results = (await this.neo4j.session().run(`Match (n:Artist) Where toUpper(n.name) CONTAINS toUpper('${name}') return n;`)).records;
        let artists = [];
        artists_results.forEach(result=>{
            const fields = result["_fields"][0];
            artists.push({
                id: fields.identity.low,
                name: fields.properties.name,
                country: fields.properties.country,
                type: fields.properties.type,
                imageUrl: fields.properties.imageUrl,
            })
        })
        return artists;
    }

    async getArtist(id: number) {
        const artist_result = (await this.neo4j.session().run(`Match (n:Artist) Where ID(n)=${id} return n;`)).records[0];
        if (artist_result) {
            let albums = [];
            const albums_results = (await this.neo4j.session().run(`MATCH (al:Album)-[:BY_ARTIST]-(ar:Artist) WHERE ID(ar)=${id}
            RETURN al;`)).records;
            albums_results.forEach(result => {
                const fields = result["_fields"][0];
                albums.push({
                    id: fields.identity.low,
                    name: fields.properties.name,
                    coverUrl: fields.properties.coverUrl,
                    year: fields.properties.year.low
                })
            })
            const fields = artist_result["_fields"][0];
            const artist = {
                id: fields.identity.low,
                name: fields.properties.name,
                country: fields.properties.country,
                type: fields.properties.type,
                imageUrl: fields.properties.imageUrl,
                albums: albums,
            }

            return artist;
        }
        else throw new NotFoundException('Artist not found');
    }
    
}
