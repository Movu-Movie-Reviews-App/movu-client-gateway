import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Inject } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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
  async findByContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Query() findReviewsDto: FindReviewsDto, @GetUserId() userId?: string
  ) {
    const result = await firstValueFrom(
      this.client.send('reviews.findByContent', { userId, contentId, query: findReviewsDto })
    );

    return { ...result, data: await this.attachAuthors(result.data) };
  }


  @Get(':contentId/my-review')
  @Auth()
  async findOneByUserAndContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @GetUserId() userId: string
  ) {
    const review = await firstValueFrom(
      this.client.send('reviews.findOneByUserAndContent', { contentId, userId })
    );

    if (!review) {
      return review;
    }

    const [withAuthor] = await this.attachAuthors([review]);
    return withAuthor;
  }

  /**
   * Reviews only store a userId — the profile lives in user-service — so the gateway
   * resolves the authors in one bulk call and attaches them.
   *
   * A review outlives its author (deleted account), so a missing user degrades to a
   * placeholder instead of leaving `user` undefined for the client to trip over.
   */
  private async attachAuthors(reviews: any[]) {

    if (!reviews?.length) {
      return reviews ?? [];
    }

    const ids = [...new Set(reviews.map((review) => review.userId))];

    const users = await firstValueFrom(
      this.client.send('users.findByIds', { ids })
    ).catch(() => []);

    const userById = new Map(users.map((user) => [user.id, user]));

    return reviews.map((review) => ({
      ...review,
      user: userById.get(review.userId) ?? { id: review.userId, userName: 'Deleted user' },
    }));
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
