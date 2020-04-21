import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import * as Neo4j from 'neo4j-driver';
export declare class UsersService {
    private readonly neo4j;
    constructor(neo4j: Neo4j.Driver);
    getUsers(filterDto: GetUsersFilterDto): Promise<Neo4j.Record[]>;
}
