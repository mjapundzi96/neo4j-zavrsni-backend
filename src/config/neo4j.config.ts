import * as neo4j from 'neo4j-driver';

export const neo4jProvider = {
    provide: "Neo4j",
    useFactory: () => neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "admin"))
};