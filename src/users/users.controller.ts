import { Controller, Get, ValidationPipe, Query, UseGuards, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';
import { Song, User } from 'src/models';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('/:id')
    async getUser(
        @Param('id') id: number,
        @Req() request
    ): Promise<User> {
        //console.log(request.user.id)
        return this.usersService.getUser(id);
    }

    @Get('/:id/listen_history')
    async getListenHistory(
        @Param('id') user_id: number
    ): Promise<Song[]> {
        return this.usersService.getListenHistory(user_id);
    }

    @Get('/:id/recommended_albums')
    async getRecommendedAlbums(
        @Param('id') user_id: number,
        @Query(ValidationPipe) getRecommendedFilterDto: GetRecommendedFilterDto
    ) {
        return this.usersService.getRecommendendedAlbums(user_id, getRecommendedFilterDto);
    }

    @Get('/:id/recommended_artists')
    async getRecommendedArtists(
        @Param('id') user_id: number,
        @Query(ValidationPipe) getRecommendedFilterDto: GetRecommendedFilterDto
    ) {
        return this.usersService.getRecommendedArtists(user_id, getRecommendedFilterDto);
    }
}
