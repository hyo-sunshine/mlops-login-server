import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  user_id: string

  @Column()
  user_name: string;

  @Column()
  user_pw: string;
}