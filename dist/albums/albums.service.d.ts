import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
export declare class AlbumsService {
    constructor();
    getAlbums(filterDto: GetAlbumsFilterDto): Promise<void>;
    getAlbum(id: number): Promise<void>;
}
