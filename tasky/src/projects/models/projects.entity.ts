import { TasksEntity } from "src/tasks/models/tasks.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Projects")
export class ProjectsEntity{
    @PrimaryGeneratedColumn()
    id:number 

    @OneToOne(()=>UserEntity)
    @JoinColumn()
    managerId:UserEntity

    @ManyToMany(()=>UserEntity)
    @JoinTable()
    users: UserEntity[];

    @Column()
    name: string;

    @OneToMany(() => TasksEntity, (tasks)=> tasks.project)
    tasks: TasksEntity[]
}