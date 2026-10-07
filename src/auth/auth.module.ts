import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './strategies/auth.strategy';
import { OptionalAuthGuard } from './guards/optional-auth/optional-auth.guard';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [AuthController],
  providers: [AuthStrategy, OptionalAuthGuard],
  imports: [
    PassportModule.register({ defaultStrategy: 'auth' }),
    NatsModule
  ],
  exports: [PassportModule]
})
export class AuthModule { }
