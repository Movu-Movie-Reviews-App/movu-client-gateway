import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe, Inject } from '@nestjs/common';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { FindContentDto } from './dto/find-content.dto';
import { SearchContentDto } from './dto/search-content.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';

@Controller('content')
export class ContentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Get()
  findAll(@Query() query: FindContentDto) {
    return this.contentService.findAll(query);
  }

  @Get('search')
  search(@Query() query: SearchContentDto) {
    return this.contentService.findAll(query);
  }

  @Get('top-rated-week')
  @OptionalAuth()
  findTopRatedOfTheWeek(@Query() query: FindContentDto, @GetUser() user: User) {
    return this.contentService.findTopRatedOfTheWeek(query, user?.id);
  }

  @Get('home')
  @OptionalAuth()
  getHomeContent(@Query('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum, @GetUser() user: User) {
    return this.contentService.getHomeContent(contentType, user?.id);
  }
}