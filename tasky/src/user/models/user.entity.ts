import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GenderEnum } from "../types/gender.enum";
import {hash} from 'bcrypt'
import { RoleEntity } from "./role.entity";
import { TasksEntity } from "../../tasks/models/tasks.entity";


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

    @OneToMany(() => TasksEntity, (tasks) => tasks.assignee, { nullable: true })
    tasks: TasksEntity[]

    @OneToMany(() => TasksEntity, (createdTasks)=>createdTasks.createdBy, {nullable:true})
    createdTasks: TasksEntity[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(
            this.password,
            12
        );
    }
}