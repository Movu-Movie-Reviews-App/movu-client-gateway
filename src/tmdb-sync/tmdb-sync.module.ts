import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TmdbSyncController } from './tmdb-sync.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [TmdbSyncController],
  imports: [AuthModule, NatsModule]
})
export class TmdbSyncModule { }
