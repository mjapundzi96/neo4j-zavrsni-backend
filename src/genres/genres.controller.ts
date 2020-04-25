import { Controller, Query, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service'

@Controller('genres')
export class GenresController {
    constructor(private genresService: GenresService) { }

    @Get()
    async getGenres(
    ) {
        return await this.genresService.getGenres()
    }

    @Get('/:id')
    async getGenre(
        @Param('id') id: number) {
        return await this.genresService.getGenre(id)
    }
}
