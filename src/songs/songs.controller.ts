import { Controller, Query, Get, Param, ValidationPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service'
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Song } from 'src/models';

@Controller('songs')
@UseGuards(AuthGuard())
export class SongsController {
    constructor(private songsService: SongsService) { }

    @Get()
    async getSongs(
        @Query(ValidationPipe) filterDto: GetSongsFilterDto,
    ): Promise<Song[]> {
        return this.songsService.getSongs(filterDto);
    }

    @Get('/:id')
    async getSong(
        @Param('id') id: number): Promise<Song> {
        return await this.songsService.getSong(id)
    }

    @Get('/:id/users_also_viewed')
    async getUsersAlsoViewed(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<Song[]> {
        return this.songsService.getUsersAlsoViewed(id, request.user.id)
    }

    @Get('/:id/related')
    async getRelatedSongs(
        @Param('id') id: number,
    ): Promise<Song[]> {
        return this.songsService.getRelatedSongs(id)
    }

    @Post('/:id/view')
    async viewSong(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<boolean> {
        return await this.songsService.viewSong(id, request.user.id);
    }

    @Post('/:id/like')
    async likeSong(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<boolean> {
        return await this.songsService.likeSong(id, request.user.id);
    }

    @Post('/:id/unlike')
    async unLikeSong(
        @Param('id') id: number,
        @Req() request: any
    ): Promise<boolean> {
        return await this.songsService.unLikeSong(id, request.user.id);
    }
}
