import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { Neo4jService } from './../neo4j/neo4j.service'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly neo4j: Neo4jService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51'
        })
    }

    async validate(payload: JwtPayload) {
        const { username } = payload
        const user_result = await this.neo4j.query(`MATCH (n: User) WHERE n.username = '${username}' RETURN { id: ID(n), username: n.username } as user`);
        const user = {
            ...user_result[0].get("user"),
            id:user_result[0].get("user").id.low
        };
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}