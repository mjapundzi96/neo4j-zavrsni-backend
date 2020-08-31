import { Controller, Get, Param, Req, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { Genre } from './models';
import { AuthGuard } from '@nestjs/passport';
import { SearchAllFilterDto } from './search-all-filter.dto';

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

  @Get('/my_favorite_genres')
  async getUsersAlsoViewed(
    @Req() request: any
  ): Promise<Genre[]> {
    return this.appService.getMyFavoriteGenres(request.user.id)
  }

  @Get('/search_all')
  searchAll(
    @Query(ValidationPipe) searchAllFilterDto: SearchAllFilterDto
  ) {
    return this.appService.searchAll(searchAllFilterDto);
  }
}
