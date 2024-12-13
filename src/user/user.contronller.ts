import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body('user_id') user_id: string, @Body('user_pw') user_pw: string) {
    return this.userService.login(user_id, user_pw);
  }

  @Post('user/create')
  create(@Body('user_name') user_name: string, @Body('user_id') user_id: string, @Body('user_pw') user_pw: string) {
    return this.userService.create(user_name, user_id, user_pw);
  }
}
