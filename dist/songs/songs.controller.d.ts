import { SongsService } from './songs.service';
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
export declare class SongsController {
    private SongsService;
    constructor(SongsService: SongsService);
    getSongs(filterDto: GetSongsFilterDto): Promise<void>;
    getSong(id: number): Promise<void>;
    viewSong(id: number, request: any): Promise<boolean>;
}
