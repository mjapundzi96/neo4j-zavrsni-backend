import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { Neo4jService } from './../neo4j/neo4j.service'
import { Song } from 'src/models';

@Injectable()
export class SongsService {
    constructor(
        private readonly neo4j: Neo4jService
    ) { }
    async getSongs(filterDto: GetSongsFilterDto): Promise<Song[]> {
        const { tag } = filterDto;
        const song_results = await this.neo4j.query(`MATCH (t:Tag)-[:TAG]-(s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        WHERE t.name = "${tag}"
        RETURN s as song,al as album,ar as artist ORDER BY s.views DESC LIMIT 24`)
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            return {
                ...songObj.properties,
                id: songObj.identity.low,
                views: songObj.properties.views.low,
                album: {
                    ...albumObj.properties,
                    id: albumObj.identity.low,
                    year: albumObj.properties.low,
                    artist: {
                        ...artistObj.properties,
                        id: artistObj.identity.low,
                    }
                }
            }
        })

        return songs;
    }

    async getSong(id: number): Promise<Song> {
        const song_result = await this.neo4j.query(`MATCH (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE ID(s)=${id}
        MATCH (s)-[:TAG]-(t:Tag)
        WITH s,al,ar,collect(t.name) as tags
        RETURN {
            id:ID(s),
            title:s.title,
            likes:s.likes,
            views:s.views,
            tags:tags,
            songUrl:s.songUrl,
            album:{
                id: ID(al),
                name:al.name,
                year:al.year,
                artist:{
                    id:ID(ar),
                    name:ar.name
                }
            }
        } as song;`)
        const songObj = song_result[0].get('song');
        const { album } = songObj
        const { artist } = album
        if (songObj) {
            return {
                ...songObj,
                id: songObj.id.low,
                views: songObj.views.low,
                likes: songObj.likes.low,
                album: {
                    ...album,
                    id: album.id.low,
                    year: album.year.low,
                    artist: {
                        ...artist,
                        id: artist.id.low,
                    }
                }
            }
        }
        else throw new NotFoundException('Song not found');
    }

    async getUsersAlsoViewed(id: number, user_id: number): Promise<Song[]> {
        const song_results = await this.neo4j.query(`MATCH (s:Song)<-[:HAS_VIEWED]-(u:User)-[:HAS_VIEWED]->(rec:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        WHERE ID(u)<>${user_id} AND ID(s)=${id} AND ID(rec)<>${id}
        RETURN rec AS song,ar AS artist,al AS album,COUNT(*) AS usersWhoAlsoViewed
        ORDER BY usersWhoAlsoViewed DESC LIMIT 24`)
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            const { properties:songProps } = songObj
            const { properties:albumProps } = albumObj
            const { properties:artistProps } = artistObj
            return {
                ...songProps,
                id: songObj.identity.low,
                views: songProps.views.low,
                album: {
                    ...albumProps,
                    id: albumObj.identity.low,
                    year: albumProps.year.low,
                    artist: {
                        ...artistProps,
                        id: artistObj.identity.low,
                    }
                }
            }
        })

        return songs;

        return songs;
    }

    async getSongsWithSimilarTags(id: number): Promise<Song[]> {
        const song_results = await this.neo4j.query(`MATCH (s1:Song)-[:TAG]-(t) WHERE ID(s1)=${id}
        WITH ID(s1) as id_s1, t ORDER BY SIZE(t.name) DESC
        MATCH (t)-[r:TAG]-(s2:Song)-[:FROM_ALBUM]-(al:Album)-[:BY_ARTIST]-(ar:Artist) WHERE id_s1 <> ID(s2)
        RETURN s2 as song,al as album,ar as artist, count(r) as mutualTags ORDER BY mutualTags DESC, s2.views DESC limit 24`)
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            const { properties:songProps } = songObj
            const { properties:albumProps } = albumObj
            const { properties:artistProps } = artistObj
            return {
                ...songProps,
                id: songObj.identity.low,
                views: songProps.views.low,
                album: {
                    ...albumProps,
                    id: albumObj.identity.low,
                    year: albumProps.year.low,
                    artist: {
                        ...artistProps,
                        id: artistObj.identity.low,
                    }
                }
            }
        })

        return songs;
    }

    async getRelatedSongs(id: number): Promise<Song[]> {
        const song_results = await this.neo4j.query(`MATCH p=(s:Song)-[r*..6]-(s2:Song) WHERE id(s)=${id} AND NONE(rel in r WHERE type(rel)='HAS_VIEWED' OR type(rel)='LIKED' OR type(rel)='HAS_FAVORITE_GENRE' OR (type(rel)='FEATURING' AND length(p) > 1))
        WITH COUNT(r) as relationships,length(p) as length,s2 ORDER by relationships DESC,length ASC,s2.views DESC
        MATCH (s2)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]->(ar:Artist)
        RETURN DISTINCT s2 as song, al as album, ar as artist ORDER BY s2.views DESC LIMIT 12;`)
        const songs = song_results.map(result => {
            const songObj = result.get('song');
            const albumObj = result.get('album');
            const artistObj = result.get('artist');
            return {
                ...songObj.properties,
                id: songObj.identity.low,
                views: songObj.properties.views.low,
                album: {
                    ...albumObj.properties,
                    id: albumObj.identity.low,
                    year: albumObj.properties.low,
                    artist: {
                        ...artistObj.properties,
                        id: artistObj.identity.low,
                    }
                }
            }
        })

        return songs;
    }

    



    async viewSong(id: number, user_id: number): Promise<boolean> {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:HAS_VIEWED]->(s)
        SET s.views = s.views + 1
        SET r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`)
        if (result[0].get('result')) {
            return true;
        }
        else throw new NotFoundException('User or song does not exist');
    }

    async likeSong(id: number, user_id: number): Promise<boolean> {
        const result = await this.neo4j.query(`MATCH (u:User),(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        CREATE (u)-[r:LIKED]->(s)
        set s.likes = s.likes + 1
        set r.date_time = datetime({timezone:'Europe/Zagreb'})
        RETURN true AS result`)
        if (result[0].get('result')) {
            return true;
        }
        else throw new NotFoundException('User or song does not exist');
    }

    async unLikeSong(id: number, user_id: number): Promise<boolean> {
        const result = await this.neo4j.query(`MATCH (u:User)-[r:LIKED]-(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        set s.likes = s.likes - 1
        DELETE r
        return true as result;`)
        if (result[0]) {
            return true;
        }
        else throw new NotFoundException('User or song does not exist');
    }

    async getHasLiked(id: number, user_id: number): Promise<boolean> {
        const result = await this.neo4j.query(`MATCH (u:User)-[r:LIKED]-(s:Song)
        WHERE ID(u)=${user_id} and ID(s)=${id}
        return true as result;`)
        if (result[0]) {
            return result[0].get('result');
        }
        return false;
    }
}
