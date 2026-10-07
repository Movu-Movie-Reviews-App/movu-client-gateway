import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [WishlistController],
  imports: [AuthModule, NatsModule],
})
export class WishlistModule { }
