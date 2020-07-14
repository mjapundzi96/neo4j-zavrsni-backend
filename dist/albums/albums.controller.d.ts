import { AlbumsService } from './albums.service';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { Album } from 'src/models';
export declare class AlbumsController {
    private AlbumsService;
    constructor(AlbumsService: AlbumsService);
    getAlbums(filterDto: GetAlbumsFilterDto): Promise<Album[]>;
    getAlbum(id: number): Promise<Album>;
}
