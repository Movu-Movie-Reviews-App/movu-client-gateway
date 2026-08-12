import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { NATS_SERVICE } from 'src/config/services';

@Controller()
export class MoviesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  //TODO! Construir response para que incluya el favorites y wishlist
  @Get(':id')
  @OptionalAuth()
  findMovieDetails(@Param('id', ParseUUIDPipe) id: string, @GetUserId() userId: string) {
    return this.client.send('movies.findDetails', { id });
  }

}
