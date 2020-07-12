import { JwtPayload } from './jwt-payload.interface';
import { Neo4jService } from './../neo4j/neo4j.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
