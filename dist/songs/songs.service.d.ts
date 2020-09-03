import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { Neo4jService } from './../neo4j/neo4j.service';
import { Song } from 'src/models';
export declare class SongsService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getSongs(filterDto: GetSongsFilterDto): Promise<Song[]>;
    getSong(id: number): Promise<Song>;
    getUsersAlsoViewed(id: number, user_id: number): Promise<Song[]>;
    getSongsWithSimilarTags(id: number): Promise<Song[]>;
    getRelatedSongs(id: number): Promise<Song[]>;
    viewSong(id: number, user_id: number): Promise<boolean>;
    likeSong(id: number, user_id: number): Promise<boolean>;
    unLikeSong(id: number, user_id: number): Promise<boolean>;
    getHasLiked(id: number, user_id: number): Promise<boolean>;
}
