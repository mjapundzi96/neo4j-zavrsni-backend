import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from './../users/users.service'
import * as Neo4j from 'neo4j-driver'
//import { UserRepository } from './user.repository';

import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject("Neo4j") private readonly neo4j: Neo4j.Driver
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51'
        })
    }

    async validate(payload: JwtPayload) {
        const { username } = payload
        const user = (await this.neo4j.session().run("MATCH (n: User) WHERE n.username = $username RETURN n", { username: username }));
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}