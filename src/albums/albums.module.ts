import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { neo4jProvider } from 'src/config/neo4j.config';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService,neo4jProvider]
})
export class AlbumsModule {}
