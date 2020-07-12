import neo4j, { Result, Driver, QueryResult, Record } from 'neo4j-driver'
import { Injectable, Inject } from '@nestjs/common';
import { Neo4jConfig } from 'src/neo4j/neo4j-config.interface';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';
import { throwError } from 'rxjs';

@Injectable()
export class Neo4jService {

    constructor(
        @Inject(NEO4J_DRIVER) private readonly driver: Driver
    ) { }


    async query(cypher: string): Promise<Record[]> {
        const session = this.driver.session()
        return session.run(cypher).then(results=>
            results.records
        )
        .catch(error=>{
            throw new Error(error)
        })
    }
}
