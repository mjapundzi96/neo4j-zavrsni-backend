import { Driver, Record } from 'neo4j-driver';
export declare class Neo4jService {
    private readonly driver;
    constructor(driver: Driver);
    query(cypher: string): Promise<Record[]>;
}
