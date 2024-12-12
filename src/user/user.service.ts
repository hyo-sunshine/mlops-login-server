import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntityRepository } from './entity/user.entity.repository';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

@Injectable()
export class UserService {
    KONG_ADMIN_API: string;
    constructor(
        @InjectRepository(UserEntityRepository) // 사용하지 않아도 정상적으로 동작하는가? 
        private userRepository: UserEntityRepository
    ) {
        this.KONG_ADMIN_API = process.env.KONG_ADMIN_API; 
    }

    async create(user_name: string, user_id: string, user_pw: string) {
        const user = this.userRepository.create({ user_name, user_id, user_pw });
        await this.userRepository.save(user);
    
        const consumerResponse = await axios.post(this.KONG_ADMIN_API + '/consumers', { username: user_id },
        );
    
        if (!consumerResponse.data.id) {
          throw new HttpException('Failed to create consumer in Kong', HttpStatus.BAD_REQUEST);
        }
    
        return user;
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
