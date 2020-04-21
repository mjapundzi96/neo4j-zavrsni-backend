import { JwtPayload } from './jwt-payload.interface';
import * as Neo4j from 'neo4j-driver';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    validate(payload: JwtPayload): Promise<Neo4j.QueryResult>;
}
export {};
