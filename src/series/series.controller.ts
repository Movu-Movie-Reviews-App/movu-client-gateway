import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { NATS_SERVICE } from 'src/config';

@Controller('series')
export class SeriesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  //TODO! construir la response para mostrar las wishlist y los favoritos
  @Get(':id')
  @OptionalAuth()
  findSeriesDetails(@Param('id', ParseUUIDPipe) id: string, @GetUserId() userId: string) {
    return this.client.send('series.findDetails', { id })
  }

}
