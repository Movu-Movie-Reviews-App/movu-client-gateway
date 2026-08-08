import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { NATS_SERVICE } from 'src/config';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Get()
  findAll() {
    return this.client.send('users.findAll', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('users.findOne', { id });
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.client.send('users.create', createUserDto);
  }

  //TODO: Add Auth()
  //TODO: If the user is a normal user, only let them delete their own account, otherwise, only admins can delete any account
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.client.send('users.update', { id, ...updateUserDto });
  }

  //TODO: Add Auth()
  //TODO: If the user is a normal user, only let them delete their own account, otherwise, only admins can delete any account
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('users.remove', { id });
  }


}
