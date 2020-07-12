import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { Neo4jService } from './../neo4j/neo4j.service';
export declare class AuthService {
    private jwtService;
    private readonly neo4j;
    constructor(jwtService: JwtService, neo4j: Neo4jService);
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<boolean>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
        user_id: number;
    }>;
    validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<any>;
    private hashPassword;
}
