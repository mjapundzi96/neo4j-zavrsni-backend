import { Injectable, NotFoundException } from '@nestjs/common';
import { Genre, Song, Album } from './models';
import { Neo4jService } from './neo4j/neo4j.service'
import { Artist } from './models/artist.model';
import { SearchAllFilterDto } from './search-all-filter.dto';
import { MostPopularFilterDto } from './most-popular-filter.dto';


@Injectable()
export class AppService {
  constructor(
    private readonly neo4j: Neo4jService
  ) { }

  async getHello() {
    return 'hello';
  }


  async getBestOfPreferredArtist(user_id: number): Promise<{ artist: Artist, songs: Song[] }> {
    const result = await this.neo4j.query(`
    CALL {
      MATCH (u:User)-[:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id}
      MATCH (s)-[:FROM_ALBUM]-(al:Album)-[r:BY_ARTIST]-(ar:Artist)
      WITH DISTINCT ar,COUNT(r) as artist_cnt limit 1
      return ar as result,artist_cnt ORDER BY artist_cnt DESC
    }
    with collect(result)[0] as artist
    match (artist)-[:BY_ARTIST]-(al:Album)-[:FROM_ALBUM]-(s:Song)
    with artist,(3*s.likes)+(2*s.views) as score,al,s ORDER BY score DESC LIMIT 12
    return {
      artist:{
        id:ID(artist),
        name: artist.name
      },
        songs: collect({
            id:ID(s),
            title:s.title,
            album:{
              id: ID(al),
              coverUrl:al.coverUrl,
              name: al.name,
              year: al.year
            }
          })
    } as res;`)
    if (result[0]) {
      const resultObj = result[0].get("res")
      const { artist } = resultObj
      const { songs } = resultObj
      return {
        artist:{
          ...artist,
          id:artist.id.low
        },
        songs: songs.map(song=>{
          return {
            ...song,
            id:song.id.low
          }
        })
      }
    }
    return null
  }

  async getBestOfPreferredGenre(user_id: number): Promise<{ genre: Genre, songs: Song[] }> {
    const result = await this.neo4j.query(`
    CALL{
      MATCH (u:User)-[:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id}
      MATCH (s)-[:FROM_ALBUM]-(:Album)-[:BY_ARTIST]-(:Artist)-[r:IS_GENRE]-(g:Genre)
      WITH DISTINCT g,COUNT(r) as genre_cnt limit 1
      return g as result,genre_cnt ORDER BY genre_cnt DESC
    }
    with collect(result)[0] as genre
    match (genre)-[:IS_GENRE]-(ar:Artist)-[:BY_ARTIST]-(al:Album)-[:FROM_ALBUM]-(s:Song)
    with genre,(3*s.likes)+(2*s.views) as score,ar,al,s ORDER BY score DESC LIMIT 12
    return {
      genre: {
        id:ID(genre),
          name:genre.name
      },
      songs: collect({
        id:ID(s),
          title:s.title,
          album:{
            id: ID(al),
            coverUrl:al.coverUrl,
            name: al.name,
            year: al.year,
            artist:{
              id:ID(ar),
              name:ar.name
            }
          }
      })
    } as res;`)
    if (result[0]) {
      const resultObj = result[0].get("res")
      const { genre } = resultObj
      const { songs } = resultObj
      return {
        genre:{
          ...genre,
          id:genre.id.low
        },
        songs: songs.map(song=>{
          return {
            ...song,
            id:song.id.low
          }
        })
      }
    }
    return null
  }

  async getBestOfPreferredDecade(user_id: number): Promise<{ decade: number, songs: Song[] }> {
    const result = await this.neo4j.query(`
    call {
      MATCH (u:User)-[:HAS_VIEWED]-(s:Song) WHERE ID(u)=${user_id}
      MATCH (s)-[r:FROM_ALBUM]-(al:Album)
      return DISTINCT toInteger(round(al.year / 10) * 10) as decades,count(r) ORDER BY count(r) DESC LIMIT 1
    } with collect(decades)[0] as decade
    MATCH (s:Song)-[:FROM_ALBUM]-(al:Album)-[:BY_ARTIST]-(ar:Artist) WHERE toInteger(round(al.year / 10) * 10)=decade
    WITH decade,(3*s.likes)+(2*s.views) as score,al,ar,s ORDER BY score DESC LIMIT 12
    return {
        decade:decade,
        songs: collect({
          id:ID(s),
          title:s.title,
          album:{
            id: ID(al),
            coverUrl:al.coverUrl,
            name: al.name,
            year: al.year,
            artist:{
              id:ID(ar),
              name:ar.name
            }
          }
      })
    } as res;`)
    if (result[0]) {
      const resultObj = result[0].get("res")
      const { decade } = resultObj
      const { songs } = resultObj
      return {
        decade: decade.low,
        songs: songs.map(song=>{
          return {
            ...song,
            id:song.id.low
          }
        })
      }
    }
    return null
  }

  async getMostPopularSongs(mostPopularFilterDto:MostPopularFilterDto){
    let query = 'MATCH p=(s:Song)-[rel]-()'
    const { period } = mostPopularFilterDto
    switch (period){
      case 'week':
        query += `
        WHERE rel.date_time.week = datetime().week 
        AND rel.date_time.year = datetime().year
        `;
        break;
      case 'month':
        query += ` 
        WHERE rel.date_time.month = datetime().month 
        AND rel.date_time.year = datetime().year
        `
        break;
    }
    query += `
     WITH s,
    SUM(
      CASE 
        WHEN any(r in relationships(p) WHERE type(r)='HAS_VIEWED') 
        THEN 1 
        ELSE 0 
      END) as views,
    SUM(
      CASE 
      WHEN any(r in relationships(p) WHERE type(r)='LIKED') 
      THEN 1 
      ELSE 0 END) as likes
    WITH views,likes,s
    MATCH (s:Song)-[:FROM_ALBUM]-(al:Album)-[:BY_ARTIST]-(ar:Artist)
    RETURN (3*likes)+(2*views) AS score,{
      id:ID(s),
        title:s.title,
        album:{
          coverUrl:al.coverUrl,
            artist:{
              name:ar.name
            }
        }
    } AS result ORDER BY score DESC LIMIT 24;
    `
    const song_results = await this.neo4j.query(query)
    const results = song_results.map(result => {
      const resultObj = result.get('result');
      return {
        ...resultObj,
        id: resultObj.id.low,
      }
    })
    return results;
  }

  async searchAll(searchAllFilterDto: SearchAllFilterDto): Promise<Array<Partial<Artist | Song | Album>>> {
    const { search } = searchAllFilterDto;
    const result_results = await this.neo4j.query(`
    CALL{ 
      MATCH (ar:Artist)
       WHERE toUpper(ar.name) CONTAINS toUpper('${search}')
      RETURN {
      	priority:3,
        type:'Artist',
        id:id(ar),
          name:ar.name,
          imageUrl:ar.imageUrl
      } as result
      UNION
      MATCH (al:Album)-[:BY_ARTIST]->(ar:Artist) 
      WHERE toUpper(al.name) CONTAINS toUpper('${search}') OR toUpper(ar.name) CONTAINS toUpper('${search}')
      WITH distinct al,ar
      RETURN {
      	priority:2,
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
      MATCH (s:Song)-[:FROM_ALBUM]->(al:Album)-[:BY_ARTIST]-(ar:Artist) 
      WHERE toUpper(s.title) CONTAINS toUpper('${search}') OR toUpper(al.name) CONTAINS toUpper('${search}') OR toUpper(ar.name) CONTAINS toUpper('${search}')
      WITH distinct s,al,ar
      RETURN {
      	priority:1,
        type:'Song',
        id:ID(s),
        title:s.title,
        album:{
          name:al.name,
          year: al.year,
          coverUrl:al.coverUrl,
          artist:{
            name:ar.name
          }
        }
      } as result
    } 
    return DISTINCT result ORDER BY result.priority DESC limit 10`)
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
