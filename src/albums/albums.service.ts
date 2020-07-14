import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Album } from 'src/models';

@Injectable()
export class AlbumsService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }

    async getAlbums(filterDto: GetAlbumsFilterDto): Promise<Album[]> {
        const { name } = filterDto;
        const album_results = await this.neo4j.query(`MATCH (n:Album) WHERE toUpper(n.name) CONTAINS toUpper('${name}') return {
            id: ID(n),
            name: n.name,
            year: n.year,
            coverUrl: n.coverUrl
        } as album;`);
        const albums = album_results.map(result => {
            const albumObj = result.get('album');
            return {
                ...albumObj,
                id: albumObj.id.low,
                year: albumObj.year.low
            }
        })
        return albums;
    }

    async getAlbum(id: number): Promise<Album> {
        const albums_result = await this.neo4j.query(`MATCH (a:Album)<-[:FROM_ALBUM]-(s:Song)
        WITH a, collect({ id: id(s), title: s.title,views:s.views,songUrl:s.songUrl }) AS song
        WITH { id: id(a), name: a.name,coverUrl:a.coverUrl,songs: song } AS album
        WHERE ID(a)=${id}
        RETURN {albums: collect(album) } AS album_return;`);
        const albumObj = albums_result[0].get('album_return').albums[0];
        if (albumObj) {
            return {
                ...albumObj,
                id: albumObj.id.low,
                songs: albumObj.songs.map(song => {
                    return {
                        ...song,
                        id: song.id.low,
                        views: song.views.low
                    }
                })
            }
        }
        else throw new NotFoundException('Album not found');
    }
}
