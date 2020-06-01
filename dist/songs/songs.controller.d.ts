import { SongsService } from './songs.service';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { ViewSongDto } from './dto/view-song.dto';
export declare class SongsController {
    private SongsService;
    constructor(SongsService: SongsService);
    getSongs(filterDto: GetSongsFilterDto): Promise<any[]>;
    getSong(id: number): Promise<{
        id: any;
        title: any;
        views: any;
        songUrl: any;
    }>;
    viewSong(id: number, viewSongDto: ViewSongDto): Promise<boolean>;
}
