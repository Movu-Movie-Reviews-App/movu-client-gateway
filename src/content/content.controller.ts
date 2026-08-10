import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe, Inject } from '@nestjs/common';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { FindContentDto } from './dto/find-content.dto';
import { SearchContentDto } from './dto/search-content.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';

@Controller('content')
export class ContentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Get()
  findAll(@Query() query: FindContentDto) {
    return this.client.send('content.findAll', FindContentDto)
  }

  @Get('search')
  search(@Query() query: SearchContentDto) {
    return this.client.send('content.search', query)
  }

  @Get('top-rated-week')
  @OptionalAuth()
  findTopRatedOfTheWeek(@Query() query: FindContentDto) {
    return this.client.send('content.findTopRatedOfTheWeek', query)
  }

  @Get('home')
  @OptionalAuth()
  getHomeContent(@Query('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum, @GetUserId() userId: string) {
    //TODO! completar la respuesta buscando los wishlist y favoritos para luego armar un response (BFF)
    return this.client.send('content.findByGenre', {})
  }
}