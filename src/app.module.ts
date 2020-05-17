import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { neo4jProvider } from './config/neo4j.config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { ArtistsModule } from './artists/artists.module';


@Module({
  imports: [AuthModule, UsersModule, GenresModule, ArtistsModule],
  controllers: [AppController],
  providers: [AppService, neo4jProvider],
})
export class AppModule { }
