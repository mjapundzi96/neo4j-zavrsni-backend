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
const neo4j_service_1 = require("../neo4j/neo4j.service");
const models_1 = require("../models");
let AlbumsService = class AlbumsService {
    constructor(neo4j) {
        this.neo4j = neo4j;
    }
    async getAlbum(id) {
        const album_result = await this.neo4j.query(`
        MATCH (al:Album)-[:BY_ARTIST]->(ar:Artist) WHERE ID(al)=${id}
        WITH al,ar
        MATCH (al)<-[:FROM_ALBUM]-(s:Song)
        WITH al,ar,
        COLLECT({
            id: ID(s),
            views: s.views,
            title: s.title
        }) AS songs
        RETURN {
            id: ID(al),
            name: al.name,
            coverUrl: al.coverUrl,
            year: al.year,
            artist:{
                id:ID(ar),
                name:ar.name
            },
            songs:songs
        } AS album`);
        const albumObj = album_result[0].get('album');
        if (albumObj) {
            return Object.assign(Object.assign({}, albumObj), { id: albumObj.id.low, year: albumObj.year.low, artist: Object.assign(Object.assign({}, albumObj.artist), { id: albumObj.artist.id.low }), songs: albumObj.songs.map(song => {
                    return Object.assign(Object.assign({}, song), { id: song.id.low, views: song.views.low });
                }) });
        }
        else
            throw new common_1.NotFoundException('Album not found');
    }
};
AlbumsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService])
], AlbumsService);
exports.AlbumsService = AlbumsService;
//# sourceMappingURL=albums.service.js.map