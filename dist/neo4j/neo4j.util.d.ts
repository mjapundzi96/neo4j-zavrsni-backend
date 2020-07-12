import { Driver } from 'neo4j-driver';
import { Neo4jConfig } from './neo4j-config.interface';
export declare const createDriver: (config: Neo4jConfig) => Promise<Driver>;
