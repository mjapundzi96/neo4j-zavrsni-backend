"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j = require("neo4j-driver");
exports.Neo4jProvider = {
    provide: "Neo4j",
    useFactory: () => neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "admin"))
};
//# sourceMappingURL=neo4j.config.js.map