import { Module } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config/services';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers
                }
            }
        ])
    ],
    exports: [ClientsModule.register([
        {
            name: NATS_SERVICE,
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers
            }
        }
    ])]
})
export class NatsModule {

}
