import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { neo4jProvider } from 'src/config/neo4j.config';

@Module({
  controllers: [GenresController],
  providers: [GenresService,neo4jProvider]
})
export class GenresModule {}
