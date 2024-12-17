import { DataSource, EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./user.entity";

@EntityRepository(UserEntity)
export class UserEntityRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
      }
}