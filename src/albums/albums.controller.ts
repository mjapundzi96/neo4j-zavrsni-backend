import { Controller, Get, Param } from '@nestjs/common';
import { AlbumsService } from './albums.service'
import { Album } from 'src/models';

@Controller('albums')
export class AlbumsController {
    constructor(private AlbumsService: AlbumsService) { }

    @Get('/:id')
    async getAlbum(
        @Param('id') id: number):Promise<Album> {
        return await this.AlbumsService.getAlbum(id);
    }
}
