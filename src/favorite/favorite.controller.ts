import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Inject } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';

@Controller('favorite')
export class FavoriteController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  @Auth()
  create(@GetUserId() userId: string, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.client.send('favorites.create', { userId, ...createFavoriteDto })
  }

  @Get()
  @Auth()
  findAllByUser(@GetUserId() userId: string) {
    return this.client.send('favorites.findAllByUser', { userId })
  }

  @Get(':contentId')
  @Auth()
  findOne(@GetUserId() userId: string, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.client.send('favorites.findOne', { userId, contentId })
  }

  @Delete(':contentId')
  @Auth()
  remove(@GetUserId() userId: string, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.client.send('favorites.remove', { userId, contentId })
  }
}
