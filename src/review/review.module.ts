import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ContentModule } from 'src/content/content.module';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [ReviewController],
  imports: [AuthModule, NatsModule],
})
export class ReviewModule { }
