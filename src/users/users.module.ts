import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config';

@Module({
  controllers: [UsersController],
  imports: [ClientsModule.register([
    {
      name: NATS_SERVICE,
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  ])]
})
export class UsersModule { }
