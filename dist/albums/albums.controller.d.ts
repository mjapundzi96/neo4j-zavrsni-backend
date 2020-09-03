import { AlbumsService } from './albums.service';
import { Album } from 'src/models';
export declare class AlbumsController {
    private AlbumsService;
    constructor(AlbumsService: AlbumsService);
    getAlbum(id: number): Promise<Album>;
}
