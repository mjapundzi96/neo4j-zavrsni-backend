import { Controller, Query, Get, Param, ValidationPipe } from '@nestjs/common';
import { ArtistsService } from './artists.service'
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
import { Artist } from 'src/models/artist.model';

@Controller('artists')
export class ArtistsController {
    constructor(private artistsService: ArtistsService) { }

    @Get()
    async getArtists(
        @Query(ValidationPipe) filterDto: GetArtistsFilterDto,
    ): Promise<Artist[]> {
        return this.artistsService.getArtists(filterDto);
    }

    @Get('/:id')
    async getArtist(
        @Param('id') id: number): Promise<Artist> {
        return await this.artistsService.getArtist(id)
    }
}
