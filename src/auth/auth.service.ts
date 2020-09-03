import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model'
import { Neo4jService } from './../neo4j/neo4j.service'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly neo4j: Neo4jService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto):Promise<boolean> {
        const { username, password } = authCredentialsDto
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        try {
            await this.neo4j.query(`
            CREATE (n: User {
                username: '${user.username}', 
                password: '${user.password}', 
                salt: '${user.salt}' })
            `);
            return true;
        }
        catch (err) {
            throw new BadRequestException(err)
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user_id: number }> {
        const user = await this.validateUserPassword(authCredentialsDto)
        if (!user) {
            throw new BadRequestException('Invalid credentials')
        }
        const username = user.username;
        const id = user.id;
       
        const payload: JwtPayload = { username,id };
        const accessToken = await this.jwtService.sign(payload)
        const user_result = await this.neo4j.query(`MATCH (n:User {username: '${username}'}) RETURN { id: ID(n) } AS user`)
        const user_id = user_result[0].get('user').id.low
        return {
            accessToken: accessToken,
            user_id: user_id
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;
        const user_result = await this.neo4j.query(`MATCH (n:User {username: '${username}'}) RETURN {
            id: ID(n),
            username:n.username,
            password: n.password,
            salt: n.salt
        } as user;`)
        if (user_result.length) {
            const user = {
                ...user_result[0].get("user"),
                id: user_result[0].get("user").id.low
            }

            const hash = await bcrypt.hash(password, user.salt)
            if (user && hash === user.password) {
                return user
            } else {
                return null;
            }
        }

    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    }
}