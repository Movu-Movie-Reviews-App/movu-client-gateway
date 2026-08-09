import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TransportModule } from './transport/nats.module';

@Module({
  imports: [UsersModule, TransportModule],
})
export class AppModule { }
