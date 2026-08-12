import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NatsModule } from './transport/nats.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { MovieModule } from './movie/movie.module';
import { SeriesModule } from './series/series.module';
import { GenresModule } from './genres/genres.module';
import { ReviewModule } from './review/review.module';
import { FavoriteModule } from './favorite/favorite.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { TmdbSyncModule } from './tmdb-sync/tmdb-sync.module';

@Module({
  imports: [
    UsersModule,
    NatsModule,
    AuthModule,
    ContentModule,
    MovieModule,
    SeriesModule,
    GenresModule,
    ReviewModule,
    FavoriteModule,
    WishlistModule,
    TmdbSyncModule,
  ],
})
export class AppModule { }
