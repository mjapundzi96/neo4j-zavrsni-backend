import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { ArtistsModule } from './artists/artists.module';
import { SongsModule } from './songs/songs.module';
import { AlbumsModule } from './albums/albums.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [AuthModule, UsersModule, GenresModule, ArtistsModule, AlbumsModule, SongsModule, 
    ConfigModule.forRoot(),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host:'localhost',
      port:'7687',
      username:'neo4j',
      password:'admin',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
