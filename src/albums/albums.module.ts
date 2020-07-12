import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Neo4jModule } from './../neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule { }
