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
    ): Promise<User> {
        return this.usersService.getUser(id);
    }
}
