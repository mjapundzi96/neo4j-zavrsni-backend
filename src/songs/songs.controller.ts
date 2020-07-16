import { Controller, Query, Get, Param, ValidationPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service'
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Song } from 'src/models';

@Controller('songs')
@UseGuards(AuthGuard())
export class SongsController {
    constructor(private SongsService: SongsService) { }

    @Get()
    async getSongs(
        @Query(ValidationPipe) filterDto: GetSongsFilterDto,
    ): Promise<Song[]> {
        return this.SongsService.getSongs(filterDto);
    }

    @Get('/:id')
    async getSong(
        @Param('id') id: number): Promise<Song> {
        return await this.SongsService.getSong(id)
    }

    @Get('/:id/users_also_viewed')
    async getUsersAlsoViewed(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<Song[]> {
        return this.SongsService.getUsersAlsoViewed(id, request.user.id)
    }

    @Post('/:id/view')
    async viewSong(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<boolean> {
        return await this.SongsService.viewSong(id, request.user.id);
    }
}
