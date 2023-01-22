import { ProjectsEntity } from "../../projects/models/projects.entity";
import { UserEntity } from "../../user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PriorityEnum } from "../types/priority.enum";


@Entity("Tasks")
export class TasksEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ type: "enum",
    enum: PriorityEnum,
    default: PriorityEnum.MEDIUM})
    priority: PriorityEnum

    @Column({unique: true})
    title: string;

    @Column({nullable:true})
    description:string

    @Column({default: false})
    completed: boolean

    @ManyToOne(()=>UserEntity, (asignee)=>asignee.tasks, {nullable:true, onDelete:"CASCADE"})
    assignee: UserEntity

    @ManyToOne(()=>UserEntity, (createdBy)=>createdBy.tasks, {onDelete:"CASCADE"})
    createdBy: UserEntity

    @ManyToOne(()=>ProjectsEntity, (project) => project.tasks, {cascade:true, nullable:true, onDelete:"CASCADE"})
    project: ProjectsEntity;


}