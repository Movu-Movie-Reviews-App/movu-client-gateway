import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [MediaController],
  imports: [NatsModule, AuthModule]

})
export class MediaModule { }
