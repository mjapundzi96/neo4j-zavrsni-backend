import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';
import { Neo4jModule } from './../neo4j/neo4j.module';


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'topSecret51',
            signOptions: {
                expiresIn: 100000,
            }
        }),
        Neo4jModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,  
    ],
    exports:[
        JwtStrategy,
        PassportModule,
    ]
})
export class AuthModule { }
