import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Neo4jModule } from './../neo4j/neo4j.module';


@Module({
  imports: [Neo4jModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule { }
