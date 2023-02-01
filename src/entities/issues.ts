import { CONNREFUSED } from "node:dns";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Repo } from "./repo";


@Entity('Issues')
export class Issues {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar"
    })
    issuesNo:number

    @Column({
        type:"varchar"
    })
    title:string

    @Column({
        type:"varchar"
    })
    desc:string

    @Column({
        type:"varchar"
    })
    user:string

    @ManyToOne(
        () => Repo,
        repo => repo.issues
    )
    @JoinColumn({
        name:"repoId"
    })
    repo:Repo
}