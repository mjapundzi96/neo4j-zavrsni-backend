import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Neo4jModule } from './../neo4j/neo4j.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [Neo4jModule,AuthModule],
  controllers: [SongsController],
  providers: [SongsService]
})
export class SongsModule {}
