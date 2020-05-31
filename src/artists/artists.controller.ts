import { Controller, Query, Get, Param } from '@nestjs/common';
import { ArtistsService } from './artists.service'

@Controller('artists')
export class ArtistsController {
    constructor(private artistsService: ArtistsService) { }

    /* @Get()
    async getGenres(
    ) {
        return await this.artistsService.getGenres()
    } */

    @Get('/:id')
    async getArtist(
        @Param('id') id: number) {
        return await this.artistsService.getArtist(id)
    }
}
