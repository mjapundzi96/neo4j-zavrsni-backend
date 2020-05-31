import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { neo4jProvider } from 'src/config/neo4j.config';

@Module({
  controllers: [SongsController],
  providers: [SongsService,neo4jProvider]
})
export class SongsModule {}
