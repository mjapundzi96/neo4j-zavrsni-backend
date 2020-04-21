import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import * as Neo4j from 'neo4j-driver';
import { User } from './../users/user.model'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        this.neo4j.session().run('CREATE (n: User {username: $username, password: $password, salt: $salt })', {
            username: user.username,
            password: user.password,
            salt: user.salt
        })
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
        const username = await this.validateUserPassword(authCredentialsDto)
        if (!username) {
            throw new BadRequestException('invalid credentials')
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload)
        return { accessToken }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = (await this.neo4j.session().run('MATCH (n:User {username: $username}) RETURN n', { username: username }))
        
        if (user.records.length){
            const userProperties = user.records[0]["_fields"][0].properties
            const hash = await bcrypt.hash(password,userProperties.salt)
            if (user && hash === userProperties.password){
                return userProperties.username
            } else {
                return null;
            }
        }
        
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    }

   // private async
}