import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { GenresService } from './genres.service'
import { Genre, Album } from './../models';
import { GetPopularFilterDto } from './get-popular-filter.dto';

@Controller('genres')
export class GenresController {
    constructor(private genresService: GenresService) { }

    @Get()
    async getGenres(): Promise<Genre[]> {
        return await this.genresService.getGenres()
    }

    @Get('/:id')
    async getGenre(
        @Param('id') id: number): Promise<Genre> {
        return await this.genresService.getGenre(id)
    }

    @Get('/:id/popular_albums')
    async getPopularAlbumsFromGenre(
        @Param('id') id: number,
        @Query(ValidationPipe) getPopularFilterDto: GetPopularFilterDto
    ): Promise<Album[]> {
        return await this.genresService.getPopularAlbumsFromGenre(id, getPopularFilterDto);
    }
}
