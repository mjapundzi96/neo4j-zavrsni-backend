import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Album } from 'src/models';

@Injectable()
export class AlbumsService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }


    async getAlbum(id: number): Promise<Album> {
        const album_result = await this.neo4j.query(`
        MATCH (al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE ID(al)=${id}
        WITH al,ar
        MATCH (al)<-[:FROM_ALBUM]-(s:Song)
        WITH al,ar,
        COLLECT({
            id: ID(s),
            views: s.views,
            title: s.title
        }) AS songs
        RETURN {
            id: ID(al),
            name: al.name,
            coverUrl: al.coverUrl,
            year: al.year,
            artist:{
                id:ID(ar),
                name:ar.name
            },
            songs:songs
        } AS album`);
        const albumObj = album_result[0].get('album');
        if (albumObj) {
            return {
                ...albumObj,
                id: albumObj.id.low,
                year: albumObj.year.low,
                artist:{
                    ...albumObj.artist,
                    id: albumObj.artist.id.low,
                },
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
