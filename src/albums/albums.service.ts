import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as Neo4j from 'neo4j-driver';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';

@Injectable()
export class AlbumsService {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }

    async getAlbums(filterDto: GetAlbumsFilterDto){
        const { name } = filterDto;
        const album_results = (await this.neo4j.session().run(`Match (n:Album) Where toUpper(n.name) CONTAINS toUpper('${name}') return n;`)).records;
        let albums = [];
        album_results.forEach(result=>{
            const fields = result["_fields"][0];
            albums.push({
                id: fields.identity.low,
                name: fields.properties.name,
                year: fields.properties.year.low,
                coverUrl: fields.properties.coverUrl,
            })
        })
        return albums;
    }

    async getAlbum(id: number) {
        const album_result = (await this.neo4j.session().run(`Match (n:Album) Where ID(n)=${id} return n;`)).records[0];
        if (album_result) {
            let songs = []
            const songs_results = (await this.neo4j.session().run(`MATCH (s:Song)-[:FROM_ALBUM]-(a:Album) WHERE ID(a)=${id} return s;`)).records;
            console.log(songs_results);
            songs_results.forEach(result => {
                const fields = result["_fields"][0];
                songs.push({
                    id: fields.identity.low,
                    title: fields.properties.title,
                    views: fields.properties.views.low,
                })
            })
            const fields = album_result["_fields"][0];
            const album = {
                id: fields.identity.low,
                name: fields.properties.name,
                year: fields.properties.year.low,
                coverUrl: fields.properties.coverUrl,
                songs: songs
            }

            return album;
        }
        else throw new NotFoundException('Album not found');
    }
}
