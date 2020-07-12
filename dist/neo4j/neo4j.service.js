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
const neo4j_config_interface_1 = require("./neo4j-config.interface");
const neo4j_constants_1 = require("./neo4j.constants");
let Neo4jService = class Neo4jService {
    constructor(driver) {
        this.driver = driver;
    }
    async query(cypher) {
        const session = this.driver.session();
        return session.run(cypher).then(results => results.records)
            .catch(error => {
            throw new Error(error);
        });
    }
};
Neo4jService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(neo4j_constants_1.NEO4J_DRIVER)),
    __metadata("design:paramtypes", [Object])
], Neo4jService);
exports.Neo4jService = Neo4jService;
//# sourceMappingURL=neo4j.service.js.map