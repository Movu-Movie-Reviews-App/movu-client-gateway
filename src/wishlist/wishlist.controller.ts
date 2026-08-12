import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Inject } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @Auth()
  create(@GetUserId() userId: string, @Body() createWishlistDto: CreateWishlistDto) {
    return this.client.send('wishlist.create', { userId, ...createWishlistDto })
  }

  @Get()
  @Auth()
  findAllByUser(@GetUserId() userId: string) {
    return this.client.send('wishlist.findAllByUser', { userId })
  }

  @Get(':contentId')
  @Auth()
  findOne(@GetUserId() userId: string, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.client.send('wishlist.findOne', { userId, contentId })
  }

  @Delete(':contentId')
  @Auth()
  remove(@GetUserId() userId: string, @Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.client.send('wishlist.remove', { userId, contentId })
  }
}
