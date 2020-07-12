import { Injectable, Inject, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Genre, Album } from './../models';
import { Neo4jService } from './../neo4j/neo4j.service'
import { GetPopularFilterDto } from './get-popular-filter.dto';

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
        const albums_results = await this.neo4j.query(`MATCH (g:Genre)<-[:IS_GENRE]-(ar:Artist)<-[:BY_ARTIST]-(al:Album)<-[:FROM_ALBUM]-(s:Song)
        WHERE ID(g)=${id}
        WITH al,ar,s,sum(s.views) AS views
        RETURN {
            id:ID(al),
            name:al.name,
            coverUrl:al.coverUrl,
            year:al.year,
            views:views,
            artist:{
                id:ID(ar),
                name:ar.name,
                imageUrl:ar.imageUrl,
                country:ar.country
            }
        } AS album ORDER BY views DESC SKIP ${offset} LIMIT ${limit};`)
        let albums = [];
        albums_results.forEach((result) => {
            const albumObj = result.get('album');
            albums.push({
                ...albumObj,
                id: albumObj.id.low,
                year: albumObj.year.low,
                artist: {
                    ...albumObj.artist,
                    id: albumObj.artist.id.low
                }
            } as Album)
        })
        return albums;
    }
}
