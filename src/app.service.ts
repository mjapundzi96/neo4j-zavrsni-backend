import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre, Song, Album } from './models';
import { Neo4jService } from './neo4j/neo4j.service'
import { Artist } from './models/artist.model';
import { SearchAllFilterDto } from './search-all-filter.dto';


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

  async searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<Array<Partial<Artist | Song | Album>>> {
    const { search } = searchAllFilterDto;
    const result_results = await this.neo4j.query(`
    CALL{ 
      MATCH (ar:Artist) WHERE toUpper(ar.name) CONTAINS toUpper('${search}')
      RETURN {
        type:'Artist',
        id:id(ar),
          name:ar.name,
          imageUrl:ar.imageUrl
      } as result
      UNION
      MATCH (al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE toUpper(al.name) CONTAINS toUpper('${search}')
      WITH distinct al,ar
      RETURN {
        id:ID(al),
        type:'Album',
        name:al.name,
        year:al.year,
        coverUrl:al.coverUrl,
        artist:{
          id:ID(ar),
          name:ar.name
        }
      } as result
      UNION 
      MATCH (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]-(ar:Artist) WHERE toUpper(s.title) CONTAINS toUpper('${search}')
      WITH distinct s,al,ar
      RETURN {
        type:'Song',
        id:ID(s),
        name:s.title,
        album:{
          name:al.name,
          year: al.year,
          coverUrl:al.coverUrl,
          artist:{
            name:ar.name
          }
        }
      } as result
    } return DISTINCT result ORDER BY result.name ASC limit 10;`)
    const results = result_results.map(result => {
      const resultObj = result.get('result');
      return {
        ...resultObj,
        id: resultObj.id.low,
      }
    })
    return results;
  }
}
