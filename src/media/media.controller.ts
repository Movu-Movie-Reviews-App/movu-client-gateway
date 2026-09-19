import { Controller, Get, Post, Body, Param, Inject, ParseEnumPipe, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { CreateMediaRequestDto } from './dto/request/create-media.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { MediaPurposeEnum } from './enums/media-purpose.enum';

@Controller('media')
export class MediaController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Auth()
  @Post('/upload')
  create(@Body() createMediaDto: CreateMediaRequestDto, @GetUserId() userId: string) {
    return this.client.send('media.uploadMedia', { ...createMediaDto, ownerId: userId });
  }

  @Auth()
  @Post('/completeUpload/:mediaPurpose/:mediaId')
  completeUpload(@Param('mediaPurpose', new ParseEnumPipe(MediaPurposeEnum)) mediaPurpose: MediaPurposeEnum, @Param('mediaId', new ParseUUIDPipe()) mediaId: string, @GetUserId() userId: string) {
    return this.client.send('media.completeMediaUpload', { mediaPurpose, mediaId, ownerId: userId });
  }

  @Auth()
  @Get('/:mediaPurpose/:mediaId/download-url')
  getDownloadUrl(@Param('mediaPurpose', new ParseEnumPipe(MediaPurposeEnum)) mediaPurpose: MediaPurposeEnum, @Param('mediaId', new ParseUUIDPipe()) mediaId: string, @GetUserId() userId: string) {
    return this.client.send('media.getDownloadUrl', { mediaPurpose, mediaId, ownerId: userId });
  }
}
