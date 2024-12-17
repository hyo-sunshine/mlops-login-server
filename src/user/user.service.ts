import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntityRepository } from './entity/user.entity.repository';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  KONG_ADMIN_API: string;
  constructor(
    private readonly dataSource: DataSource, // transaction 관리를 위해 DataSource 추가
    @InjectRepository(UserEntityRepository) private userRepository: UserEntityRepository
  ) {
      this.KONG_ADMIN_API = process.env.KONG_ADMIN_API; 
  }

  async create(user_name: string, user_id: string, user_pw: string) {
    return await this.dataSource.transaction(async (manager) => {
      const exist_user_id = await manager.findOneBy(UserEntity, { user_id });
      if (exist_user_id) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const user = manager.create(UserEntity, { user_name, user_id, user_pw });

      const consumerResponse = await axios.post(this.KONG_ADMIN_API + '/consumers', { username: user_id });

      if (!consumerResponse.data.id) {
        throw new Error('Failed to create consumer in Kong');
      }
      await manager.save(UserEntity, user);
      return {user_id};
    });
  }


  async delete(user_id: string) {
    return this.dataSource.transaction(async (manager) => {
      try {
        const exist_user = await this.userRepository.findOneBy({ user_id });
        if (!exist_user) {
          throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        }
        // Kong Admin API 호출로 Consumer 삭제
        const kongResponse = await axios.delete(this.KONG_ADMIN_API + '/consumers/' + user_id);
        if (kongResponse.status !== 204) {
          throw new Error('Failed to delete consumer in Kong');
        }
        await manager.delete(UserEntity, { user_id });
      } catch (error: any) {
        throw new HttpException(
          error.message || 'An error occurred during the operation',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    })
  }

  async login(user_id: string, user_pw: string) {
    const user = await this.userRepository.findOneBy({ user_id, user_pw });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokenResponse = await axios.post(this.KONG_ADMIN_API + `/consumers/${user_id}/jwt`);

    if (!tokenResponse.data) {
      throw new HttpException('Failed to generate JWT token', HttpStatus.BAD_REQUEST);
    }

    return { token: tokenResponse.data }; // Return JWT token
  }
}
