import { AlbumsService } from './albums.service';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
export declare class AlbumsController {
    private AlbumsService;
    constructor(AlbumsService: AlbumsService);
    getUsers(filterDto: GetAlbumsFilterDto): Promise<void>;
    getAlbum(id: number): Promise<void>;
}
