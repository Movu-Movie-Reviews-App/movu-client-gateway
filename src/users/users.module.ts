import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [UsersController],
  imports: [NatsModule]
})
export class UsersModule { }
