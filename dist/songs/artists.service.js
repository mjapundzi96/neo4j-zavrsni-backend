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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Neo4j = require("neo4j-driver");
let ArtistsService = class ArtistsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getArtist(id) {
        const artist_result = (await this.neo4j.session().run(`Match (n:Artist) Where ID(n)=${id} return n;`)).records[0];
        if (artist_result) {
            let albums = [];
            const albums_results = (await this.neo4j.session().run(`MATCH (al:Album)-[:BY_ARTIST]-(ar:Artist) WHERE ID(ar)=${id}
            RETURN al;`)).records;
            albums_results.forEach(result => {
                const fields = result["_fields"][0];
                albums.push({
                    id: fields.identity.low,
                    name: fields.properties.name,
                    coverUrl: fields.properties.coverUrl,
                    year: fields.properties.year.low
                });
            });
            const fields = artist_result["_fields"][0];
            const artist = {
                id: fields.identity.low,
                name: fields.properties.name,
                country: fields.properties.country,
                type: fields.properties.type,
                imageUrl: fields.properties.imageUrl,
                albums: albums,
            };
            return artist;
        }
        else
            throw new common_1.NotFoundException('Artist not found');
    }
};
ArtistsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject("Neo4j")),
    __metadata("design:paramtypes", [Object])
], ArtistsService);
exports.ArtistsService = ArtistsService;
//# sourceMappingURL=artists.service.js.map