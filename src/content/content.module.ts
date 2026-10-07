import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [ContentController],
  imports: [AuthModule, NatsModule]
})
export class ContentModule { }
