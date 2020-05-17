import { Controller, Get, ValidationPipe, Query, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport'

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
    ){
        return this.usersService.getUser(id);
    }

    @Get('/:id/favorite_artists')
    async getFavoriteArtists(
        @Param('id') user_id: number
    ) {
        return this.usersService.getFavoriteArtists(user_id)
    }
}
