import { Controller, Get, Inject, Post, Query } from '@nestjs/common';

import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('tmdb-sync')
export class TmdbSyncController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  syncAll(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.client.send('sync.all', { queryParameters })
  }

  @Post('movie-genres')
  syncMovieGenres() {
    return this.client.send('sync.movieGenres', {})
  }

  @Post('series-genres')
  syncSeriesGenres() {
    return this.client.send('sync.seriesGenres', {})
  }

  @Post('popular-movies')
  syncPopularMovies(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.client.send('sync.popularMovies', { queryParameters })
  }

  @Post('popular-series')
  syncPopularSeries(@Query() queryParameters: TmdbSyncPaginationDto) {
    return this.client.send('sync.popularSeries', { queryParameters })
  }

  @Get('clear')
  clearSyncedData() {
    return this.client.send('sync.clear', {})
  }



}
