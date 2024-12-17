import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntityRepository } from './entity/user.entity.repository';
import { UserService } from './user.service';
import { UserController } from './user.contronller';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule, UserEntityRepository],
  controllers: [UserController],
  providers: [UserService, UserEntityRepository],
})
export class UserModule {}
