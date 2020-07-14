import { Controller, Query, Get, Param, UseGuards, ValidationPipe, } from '@nestjs/common';
import { AlbumsService } from './albums.service'
import { AuthGuard } from '@nestjs/passport';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { Album } from 'src/models';

@Controller('albums')
export class AlbumsController {
    constructor(private AlbumsService: AlbumsService) { }

    
    @Get()
    async getAlbums(
        @Query(ValidationPipe) filterDto: GetAlbumsFilterDto,
    ):Promise<Album[]> {
        return this.AlbumsService.getAlbums(filterDto);
    }

    @Get('/:id')
    async getAlbum(
        @Param('id') id: number):Promise<Album> {
        return await this.AlbumsService.getAlbum(id);
    }
}
