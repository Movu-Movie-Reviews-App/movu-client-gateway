import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [FavoriteController],
  imports: [AuthModule, NatsModule],
})
export class FavoriteModule { }
