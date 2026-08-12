import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Inject } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';

@Controller('review')
export class ReviewController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy

  ) { }

  @Get(':contentId')
  @OptionalAuth()
  findByContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Query() findReviewsDto: FindReviewsDto, @GetUserId() userId?: string
  ) {
    return this.client.send('reviews.findByContent', { userId, contentId, query: findReviewsDto })
  }


  @Get(':contentId/my-review')
  @Auth()
  findOneByUserAndContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @GetUserId() userId: string
  ) {
    return this.client.send('reviews.findOneByUserAndContent', { contentId, userId })
  }

  @Post()
  @Auth()
  create(@Body() createReviewDto: CreateReviewDto, @GetUserId() userId: string) {

    return this.client.send('reviews.create', { userId, ...createReviewDto })
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUserId() userId: string) {
    return this.client.send('reviews.remove', { id, userId })
  }

  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @GetUserId() userId: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.client.send('reviews.update', { id, userId, ...updateReviewDto });
  }



}
