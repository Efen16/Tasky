import { TasksEntity } from "../../tasks/models/tasks.entity";
import { UserEntity } from "../../user/models/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Projects")
export class ProjectsEntity{
    @PrimaryGeneratedColumn()
    id:number 

    @OneToOne(()=>UserEntity)
    @JoinColumn()
    manager:UserEntity

    @ManyToMany(()=>UserEntity, {cascade:true})
    @JoinTable()
    users: UserEntity[];

    @Column({unique: true})
    name: string;

    @OneToMany(() => TasksEntity, (tasks)=> tasks.project)
    tasks: TasksEntity[]
}