import { Injectable, Inject, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Genre, Album } from './../models';
import { Neo4jService } from './../neo4j/neo4j.service'
import { GetPopularFilterDto } from './dto/get-popular-filter.dto';

@Injectable()
export class GenresService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }

    async getGenres(): Promise<Genre[]> {
        const genre_results = await this.neo4j.query(`MATCH (n:Genre) RETURN n {
            id:ID(n),
            name:n.name
        } as genre;`);
        let genres = []
        genre_results.forEach((res) => {
            genres.push({
                ...res.get('genre'),
                id: res.get('genre').id.low
            })
        })
        return genres;
    }

    async getGenre(id: number): Promise<Genre> {
        const genre_result = await this.neo4j.query(`MATCH (n:Genre) WHERE ID(n)=${id} RETURN {
            id:ID(n),
            name:n.name
        } AS genre`);
        if (genre_result) {
            return {
                ...genre_result[0].get('genre'),
                id: genre_result[0].get('genre').id.low
            }
        }
        else throw new NotFoundException('Genre does not exist')
    }

    async getPopularAlbumsFromGenre(id: number, getPopularFilterDto: GetPopularFilterDto): Promise<Album[]> {
        const { offset, limit } = getPopularFilterDto;
        const albums_results = await this.neo4j.query(`
        MATCH (g:Genre)<-[:IS_GENRE]-(ar:Artist)<-[:BY_ARTIST]-(al:Album)<-[:FROM_ALBUM]-(s:Song)

        WHERE ID(g)=${id}
        WITH al, ar,s,sum(s.views) AS views
        RETURN DISTINCT al AS album, ar as artist, views ORDER BY views DESC SKIP ${offset} LIMIT ${limit};`)
        let albums = [];
        albums_results.forEach((result) => {
            const albumObj = result.get('album');
            const artistObj = result.get('artist')
            console.log(albumObj)
            const { year } = albumObj.properties
         
            albums.push({
                ...albumObj.properties,
                id: albumObj.identity.low,
                year: year.low,
                artist: {
                    ...artistObj.properties,
                    id: artistObj.identity.low
                }
            } as Album)
        })
        return albums;
    }
}
