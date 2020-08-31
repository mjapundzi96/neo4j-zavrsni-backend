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
    async getMyFavoriteGenres(user_id) {
        const genres_results = await this.neo4j.query(`MATCH (u:User)-[:HAS_FAVORITE_GENRE]->(g:Genre) WHERE ID(u)=${user_id} return {
      id: ID(g),
      name: g.name
    } as genres;`);
        const genres = genres_results.map(result => {
            const genreObj = result.get('genres');
            return Object.assign(Object.assign({}, genreObj), { id: genreObj.id.low });
        });
        return genres;
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