import { Controller, Query, Get, Param, UseGuards, ValidationPipe, } from '@nestjs/common';
import { AlbumsService } from './albums.service'
import { AuthGuard } from '@nestjs/passport';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';

@Controller('albums')
export class AlbumsController {
    constructor(private AlbumsService: AlbumsService) { }

    
    @Get()
    async getUsers(
        @Query(ValidationPipe) filterDto: GetAlbumsFilterDto,
    ) {
        return this.AlbumsService.getAlbums(filterDto);
    }

    @Get('/:id')
    async getAlbum(
        @Param('id') id: number) {
        return await this.AlbumsService.getAlbum(id);
    }
}
