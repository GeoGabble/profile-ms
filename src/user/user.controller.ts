import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("new_connection")
  create(@Body() user2_id: string, @Headers() headers: any) {
    return this.userService.newConnection(headers['x-user-id'].toString(), user2_id);
  }

  @Get("connections")
  findAll(@Query() status: string, @Headers() headers: any) {
    return this.userService.findConnections(headers['x-user-id'].toString(),+status);
  }

  @Post('modify_connection/:connectionId/:status')
  modifyConnection(@Param('connectionId') id: string,@Param('status') status: string, @Headers() headers: any) {
    return this.userService.modifyConnections(+id, headers['x-user-id'].toString(), +status);
  }
}
