import { Controller, Query, Get, Param, ValidationPipe, Post, Body } from '@nestjs/common';
import { SongsService } from './songs.service'
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { ViewSongDto } from './dto/view-song.dto';

@Controller('songs')
export class SongsController {
    constructor(private SongsService: SongsService) { }

    @Get()
    async getSongs(
        @Query(ValidationPipe) filterDto: GetSongsFilterDto,
    ) {
        return this.SongsService.getSongs(filterDto);
    }

    @Get('/:id')
    async getSong(
        @Param('id') id: number) {
        return await this.SongsService.getSong(id)
    }

    @Post('/:id/view')
    async viewSong(
        @Param('id') id: number, @Body(ValidationPipe) viewSongDto: ViewSongDto) {
        return await this.SongsService.viewSong(id,viewSongDto);
    }
}
