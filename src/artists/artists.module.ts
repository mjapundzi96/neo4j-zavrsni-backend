import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { Neo4jModule } from './../neo4j/neo4j.module'

@Module({
  imports:[Neo4jModule],
  controllers: [ArtistsController],
  providers: [ArtistsService]
})
export class ArtistsModule {}
