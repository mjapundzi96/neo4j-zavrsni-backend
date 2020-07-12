import { Controller, Query, Get, Param, ValidationPipe, Post, Body, Request, Req, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service'
import { GetSongsFilterDto } from './dto/get-songs-filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('songs')
@UseGuards(AuthGuard())
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
        @Param('id') id: number,
        @Req() request: any
    ) {
        return await this.SongsService.viewSong(id,request.user.id);
    }
}
