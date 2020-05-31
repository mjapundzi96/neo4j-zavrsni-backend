import { AlbumsService } from './albums.service';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
export declare class AlbumsController {
    private AlbumsService;
    constructor(AlbumsService: AlbumsService);
    getUsers(filterDto: GetAlbumsFilterDto): Promise<any[]>;
    getAlbum(id: number): Promise<{
        id: any;
        name: any;
        year: any;
        coverUrl: any;
        songs: any[];
    }>;
}
