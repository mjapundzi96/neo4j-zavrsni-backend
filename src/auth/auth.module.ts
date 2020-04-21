import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';
import { neo4jProvider } from './../config/neo4j.config'

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'topSecret51',
            signOptions: {
                expiresIn: 3600,
            }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        neo4jProvider
    ],
    exports:[
        JwtStrategy,
        PassportModule,
    ]
})
export class AuthModule { }
