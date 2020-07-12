import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { Neo4jModule } from './../neo4j/neo4j.module';

@Module({
    imports: [AuthModule, Neo4jModule],
    controllers: [UsersController],
    providers: [UsersService]
})

export class UsersModule {

}