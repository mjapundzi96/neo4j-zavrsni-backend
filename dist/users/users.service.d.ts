import { Neo4jService } from './../neo4j/neo4j.service';
import { User } from './../models/user.model';
export declare class UsersService {
    private readonly neo4j;
    constructor(neo4j: Neo4jService);
    getUser(id: number): Promise<User>;
}
