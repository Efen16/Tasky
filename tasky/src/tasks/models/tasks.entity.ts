import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PriorityEnum } from "../types/priority.enum";


@Entity("Tasks")
export class TasksEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    priority: PriorityEnum

    @Column()
    title: string;

    @Column()
    description:string

    @Column({default: false})
    completed: boolean

    @ManyToOne(()=>UserEntity, (asignee)=>asignee.tasks)
    asignee: UserEntity

    @ManyToOne(()=>UserEntity, (createdBy)=>createdBy.tasks)
    createdBy: UserEntity



}