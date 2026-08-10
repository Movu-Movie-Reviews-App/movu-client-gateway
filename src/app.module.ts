import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NatsModule } from './transport/nats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, NatsModule, AuthModule],
})
export class AppModule { }
