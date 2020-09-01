import { Controller, Get, Param, Req, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { Genre, Song } from './models';
import { AuthGuard } from '@nestjs/passport';
import { SearchAllFilterDto } from './search-all-filter.dto';
import { Artist } from './models/artist.model';
import { MostPopularFilterDto } from './most-popular-filter.dto';

@Controller()
@UseGuards(AuthGuard())
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/bestof_preferred_genre')
  async getBestOfPreferredGenre(
    @Req() request: any
  ): Promise<{ genre: Genre, songs: Song[] }> {
    return this.appService.getBestOfPreferredGenre(request.user.id)
  }

  @Get('/bestof_preferred_artist')
  async getBestOfPreferredArtist(
    @Req() request: any
  ): Promise<{ artist: Artist, songs: Song[] }> {
    return this.appService.getBestOfPreferredArtist(request.user.id)
  }

  @Get('/bestof_preferred_decade')
  async getBestOfPreferredDecade(
    @Req() request: any
  ): Promise<{ decade: number, songs: Song[] }> {
    return this.appService.getBestOfPreferredDecade(request.user.id)
  }

  @Get('/most_popular_songs')
  async getMostPopularSongs(
    @Query(ValidationPipe) mostPopularFilterDto: MostPopularFilterDto
  ) {
    return this.appService.getMostPopularSongs(mostPopularFilterDto);
  }

  @Get('/search_all')
  async searchAll(
    @Query(ValidationPipe) searchAllFilterDto: SearchAllFilterDto
  ) {
    return this.appService.searchAll(searchAllFilterDto);
  }
}
