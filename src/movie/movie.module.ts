import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { NatsModule } from 'src/transport/nats.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MoviesController],
  imports: [NatsModule, AuthModule]
})
export class MovieModule { }
