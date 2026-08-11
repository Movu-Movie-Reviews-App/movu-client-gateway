import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [MoviesController],
  imports: [NatsModule]
})
export class MovieModule { }
