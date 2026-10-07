import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { NATS_SERVICE } from 'src/config';

@Controller('genres')
export class GenresController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  @Get()
  findAllByContentType(@Query('contentType') contentType: ContentTypeEnum) {

    return this.client.send('genres.findAllByContentType', { contentType })
  }


}
