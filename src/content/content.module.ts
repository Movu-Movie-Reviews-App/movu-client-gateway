import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ContentController],
  imports: [AuthModule]
})
export class ContentModule { }
