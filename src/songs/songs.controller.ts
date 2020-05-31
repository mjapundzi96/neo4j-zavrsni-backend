import { Controller, Query, Get, Param } from '@nestjs/common';
import { SongsService } from './songs.service'

@Controller('songs')
export class SongsController {
    constructor(private SongsService: SongsService) { }

    /* @Get()
    async getGenres(
    ) {
        return await this.SongsService.getGenres()
    } */

    @Get('/:id')
    async getSong(
        @Param('id') id: number) {
        return await this.SongsService.getSong(id)
    }
}
