import { ProjectsEntity } from "src/projects/models/projects.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PriorityEnum } from "../types/priority.enum";


@Entity("Tasks")
export class TasksEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: "enum",
    enum: PriorityEnum,
    default: PriorityEnum.LOW})
    priority: PriorityEnum

    @Column({unique: true})
    title: string;

    @Column({nullable:true})
    description:string

    @Column({default: false})
    completed: boolean

    @ManyToOne(()=>UserEntity, (asignee)=>asignee.tasks, {nullable:true})
    asignee: UserEntity

    @ManyToOne(()=>UserEntity, (createdBy)=>createdBy.tasks)
    createdBy: UserEntity

    @ManyToOne(()=>ProjectsEntity, (project) => project.tasks, {cascade:true, nullable:true})
    project: ProjectsEntity;


}