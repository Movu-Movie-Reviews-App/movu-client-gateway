import { Module } from '@nestjs/common';
import { SeriesController } from './series.controller';
import { NatsModule } from 'src/transport/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeriesController],
  imports: [NatsModule, AuthModule],
})
export class SeriesModule { }
