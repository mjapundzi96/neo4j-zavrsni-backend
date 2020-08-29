import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre } from './models';
import { Neo4jService } from './neo4j/neo4j.service'


@Injectable()
export class AppService {
  constructor(
    private readonly neo4j: Neo4jService
  ) { }

  async getHello() {
    return 'hello';
  }

  async getMyFavoriteGenres(user_id: number): Promise<Genre[]> {
    const genres_results = await this.neo4j.query(`MATCH (u:User)-[:HAS_FAVORITE_GENRE]->(g:Genre) WHERE ID(u)=${user_id} return {
      id: ID(g),
      name: g.name
    } as genres;`)
    const genres = genres_results.map(result => {
      const genreObj = result.get('genres');
      return {
        ...genreObj,
        id: genreObj.id.low,
      }
    })
    return genres;
  }
}
