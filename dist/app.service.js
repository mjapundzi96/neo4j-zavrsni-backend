"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const neo4j_service_1 = require("./neo4j/neo4j.service");
let AppService = class AppService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getHello() {
        return 'hello';
    }
    async getBestOfPreferredArtist(user_id) {
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
    } as res;`);
        if (result[0]) {
            const resultObj = result[0].get("res");
            const { artist } = resultObj;
            const { songs } = resultObj;
            return {
                artist: Object.assign(Object.assign({}, artist), { id: artist.id.low }),
                songs: songs.map(song => {
                    return Object.assign(Object.assign({}, song), { id: song.id.low });
                })
            };
        }
        return null;
    }
    async getBestOfPreferredGenre(user_id) {
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
    } as res;`);
        if (result[0]) {
            const resultObj = result[0].get("res");
            const { genre } = resultObj;
            const { songs } = resultObj;
            return {
                genre: Object.assign(Object.assign({}, genre), { id: genre.id.low }),
                songs: songs.map(song => {
                    return Object.assign(Object.assign({}, song), { id: song.id.low });
                })
            };
        }
        return null;
    }
    async getBestOfPreferredDecade(user_id) {
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
    } as res;`);
        if (result[0]) {
            const resultObj = result[0].get("res");
            const { decade } = resultObj;
            const { songs } = resultObj;
            return {
                decade: decade.low,
                songs: songs.map(song => {
                    return Object.assign(Object.assign({}, song), { id: song.id.low });
                })
            };
        }
        return null;
    }
    async searchAll(searchAllFilterDto) {
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
    } return DISTINCT result ORDER BY result.name ASC limit 10;`);
        const results = result_results.map(result => {
            const resultObj = result.get('result');
            return Object.assign(Object.assign({}, resultObj), { id: resultObj.id.low });
        });
        return results;
    }
};
AppService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map