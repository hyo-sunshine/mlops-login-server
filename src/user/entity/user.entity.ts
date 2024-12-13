import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column()
  user_name: string;

  @Column()
  user_pw: string;
}