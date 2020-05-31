import { SongsService } from './songs.service';
export declare class SongsController {
    private SongsService;
    constructor(SongsService: SongsService);
    getSong(id: number): Promise<{
        id: any;
        name: any;
        views: any;
        songUrl: any;
    }>;
}
