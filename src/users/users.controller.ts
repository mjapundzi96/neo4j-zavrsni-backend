import { Controller, Get, ValidationPipe, Query, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport'
import { GetRecommendedFilterDto } from './dto/get-recommended-filter.dto';

@Controller('users')

export class UsersController {
    constructor(private usersService: UsersService) { }
    @UseGuards(AuthGuard())
    @Get()
    async getUsers(
        @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    ) {
        return this.usersService.getUsers(filterDto);
    }

    @Get('/:id')
    async getUser(
        @Param('id') id: number
    ) {
        return this.usersService.getUser(id);
    }

    @Get('/:id/listen_history')
    async getListenHistory(
        @Param('id') user_id: number
    ) {
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
