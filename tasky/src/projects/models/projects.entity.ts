import { TasksEntity } from "src/tasks/models/tasks.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Projects")
export class ProjectsEntity{
    @PrimaryGeneratedColumn()
    id:number 

    @OneToOne(()=>UserEntity)
    @JoinColumn()
    manager:UserEntity

    @ManyToMany(()=>UserEntity)
    @JoinTable()
    users: UserEntity[];

    @Column({unique: true})
    name: string;

    @OneToMany(() => TasksEntity, (tasks)=> tasks.project)
    tasks: TasksEntity[]
}