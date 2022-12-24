import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { RoleNameEnum } from "./role.enum";
import { UserEntity } from "./user.entity";


@Entity("Roles")
export class RoleEntity{

    @PrimaryColumn()
    id: number;

    @Column({
        type: "enum",
        enum: RoleNameEnum,
        default: RoleNameEnum.EMPLOYEE
    })
    name:RoleNameEnum;


    @OneToMany(() => UserEntity, (user) => user.role)
    users: UserEntity[]
}