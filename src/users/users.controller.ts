import { Controller, Get, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async getUsers(
        @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    ) {
        return this.usersService.getUsers(filterDto)
    }
}
