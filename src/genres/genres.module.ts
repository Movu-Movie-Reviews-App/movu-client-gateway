import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [GenresController],
  imports: [NatsModule]
})
export class GenresModule { }
