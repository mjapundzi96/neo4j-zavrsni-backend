import * as neo4j from 'neo4j-driver';
export declare const neo4jProvider: {
    provide: string;
    useFactory: () => neo4j.Driver;
};
