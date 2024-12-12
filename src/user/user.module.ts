import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntityRepository } from './entity/user.entity.repository';
import { UserService } from './user.service';
import { UserController } from './user.contronller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntityRepository])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
