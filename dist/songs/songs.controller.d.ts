import { SongsService } from './songs.service';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { Song } from 'src/models';
export declare class SongsController {
    private SongsService;
    constructor(SongsService: SongsService);
    getSongs(filterDto: GetSongsFilterDto): Promise<Song[]>;
    getSong(id: number): Promise<Song>;
    getUsersAlsoViewed(id: number, request: any): Promise<Song[]>;
    viewSong(id: number, request: any): Promise<boolean>;
}
