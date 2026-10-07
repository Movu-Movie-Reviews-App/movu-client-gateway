import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe, Inject } from '@nestjs/common';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { FindContentDto } from './dto/find-content.dto';
import { SearchContentDto } from './dto/search-content.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';

@Controller('content')
export class ContentController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Get()
  findAll(@Query() query: FindContentDto) {
    return this.client.send('content.findAll', query)
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

  /**
   * BFF endpoint: content-service knows nothing about a user's lists and
   * user-service knows nothing about content, so the gateway is what stitches
   * them together. Anonymous callers get the same shape with both flags false.
   */
  @Get('home')
  @OptionalAuth()
  async getHomeContent(
    @Query('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum,
    @GetUserId() userId?: string
  ) {
    const { contentByGenre } = await firstValueFrom(
      this.client.send('content.findByGenre', { contentType })
    );

    const [favoritedIds, wishlistedIds] = await this.getUserContentFlags(userId);

    return {
      contentByGenre: contentByGenre.map((group) => ({
        ...group,
        content: group.content.map((content) => ({
          ...content,
          isFavorited: favoritedIds.has(content.id),
          isWishlisted: wishlistedIds.has(content.id),
        })),
      })),
    };
  }

  /**
   * Returns the user's favorited and wishlisted contentIds as sets, so marking a
   * content is a lookup instead of a scan. Anonymous callers get empty sets, and
   * a failing list service degrades to "not marked" rather than failing the page.
   */
  private async getUserContentFlags(userId?: string): Promise<[Set<string>, Set<string>]> {
    if (!userId) {
      return [new Set(), new Set()];
    }

    const [favorites, wishlist] = await Promise.all([
      firstValueFrom(this.client.send('favorites.findAllByUser', { userId })).catch(() => []),
      firstValueFrom(this.client.send('wishlist.findAllByUser', { userId })).catch(() => []),
    ]);

    return [
      new Set<string>(favorites.map((favorite) => favorite.contentId)),
      new Set<string>(wishlist.map((wish) => wish.contentId)),
    ];
  }
}