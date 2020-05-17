import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { neo4jProvider } from 'src/config/neo4j.config';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService,neo4jProvider]
})
export class ArtistsModule {}
