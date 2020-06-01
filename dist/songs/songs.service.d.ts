import * as Neo4j from 'neo4j-driver';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { ViewSongDto } from './dto/view-song.dto';
export declare class SongsService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getSongs(filterDto: GetSongsFilterDto): Promise<any[]>;
    getSong(id: number): Promise<{
        id: any;
        title: any;
        views: any;
        songUrl: any;
    }>;
    viewSong(id: number, viewSongDto: ViewSongDto): Promise<boolean>;
}
