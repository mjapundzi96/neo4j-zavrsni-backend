import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';

@Injectable()
export class ArtistsService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }
    async getArtists(filterDto:GetArtistsFilterDto) {
        const { name } = filterDto;
        const artist_results = await this.neo4j.query(`Match (n:Artist) Where toUpper(n.name) CONTAINS toUpper('${name}') return {
            id:ID(n),
            name:n.name,
            country:n.country,
            type:n.type,
            imageUrl: n.imageUrl
        } as artist;`)
        const artists = artist_results.map(result => {
            const artistObj = result.get('artist');
            return {
                ...artistObj,
                id: artistObj.id.low,
            }
        })
        return artists;
    }

    async getArtist(id: number) {
        const artist_result = await this.neo4j.query(`MATCH (ar:Artist)<-[:BY_ARTIST]-(al:Album)
        WITH ar, collect({ id: id(al), name: al.name,coverUrl:al.coverUrl,year:al.year }) AS album
        WITH { id: id(ar), name: ar.name,imageUrl:ar.imageUrl,albums: album } AS artist
        WHERE ID(ar)=${id}
        RETURN {artists: collect(artist) } AS artist_return;`);
        const artistObj = artist_result[0].get('artist_return').artists[0];
        if (artistObj) {
            return {
                ...artistObj,
                id: artistObj.id.low,
                albums: artistObj.albums.map(album => {
                    return {
                        ...album,
                        id: album.id.low,
                        year: album.year.low
                    }
                })
            }
        }
        else throw new NotFoundException('Artist not found');
    }
    
}
