import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GenderEnum } from "../types/gender.enum";
import {hash} from 'bcrypt'
import { RoleEntity } from "./role.entity";

@Entity("Users")
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string; 

    @Column()
    lastName: string; 

    @Column({nullable: true})
    phone: string;

    @Column({type: "enum",
             enum: GenderEnum,})
    gender: GenderEnum;

    @Column({select:false})
    password: string;
    
    @ManyToOne(()=>RoleEntity, (role)=>role.users)
    role: RoleEntity

    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(
            this.password,
            12
        );
    }
}