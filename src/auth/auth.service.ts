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
        try {
            const user_id = (await this.neo4j.session().run('CREATE (n: User {username: $username, password: $password, salt: $salt }) return n', {
                username: user.username,
                password: user.password,
                salt: user.salt
            })).records[0]["_fields"][0].identity.low
            authCredentialsDto.favorite_genres.forEach(async (genre_id) => {
                await this.neo4j.session().run(
                    `MATCH (u:User),(g:Genre) WHERE ID(u) = ${user_id} AND ID(g) = ${genre_id}
                    CREATE (u)-[r:HAS_FAVORITE_GENRE]->(g)`)
            })
            return true;
        }
        catch (err) {
            throw new BadRequestException('operation failed')
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string,user_id:number }> {
        const username = await this.validateUserPassword(authCredentialsDto)
        if (!username) {
            throw new BadRequestException('invalid credentials')
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload)
        const user = (await this.neo4j.session().run('MATCH (n:User {username: $username}) RETURN n', { username: username }))
        return { 
            accessToken:accessToken, 
            user_id: user.records[0]["_fields"][0].identity.low
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = (await this.neo4j.session().run('MATCH (n:User {username: $username}) RETURN n', { username: username }))

        if (user.records.length) {
            const userObj = user.records[0]["_fields"][0]
            const userProperties = userObj.properties;
            const hash = await bcrypt.hash(password, userProperties.salt)
            if (user && hash === userProperties.password) {
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