import { Seeder } from "@jorgebodega/typeorm-seeding";
import { RoleEntity } from "src/user/models/role.entity";
import { UserEntity } from "src/user/models/user.entity";
import { GenderEnum } from "src/user/types/gender.enum";
import { RoleNameEnum } from "src/user/types/role.enum";
import { DataSource } from "typeorm";

export default class UserSeeder extends Seeder {
    async run(dataSource: DataSource) {
    //  const users: UserEntity[];
        const admin = new RoleEntity();
        admin.id = 3;
        admin.name = RoleNameEnum.ADMIN;
        
        const user1 = new UserEntity();
        user1.firstName = "Mila";
        user1.lastName = "Milovic";
        user1.email = "mila.milovic@gmail.com";
        user1.password = "123";
        user1.gender = GenderEnum.FEMALE;

        const users: UserEntity[] = [user1];

        await dataSource.getRepository(UserEntity).save(users);

    }
  }