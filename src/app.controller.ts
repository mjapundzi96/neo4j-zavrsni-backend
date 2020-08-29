import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Genre } from './models';
import { AuthGuard } from '@nestjs/passport';

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
}
