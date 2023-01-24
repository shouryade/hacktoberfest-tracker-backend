import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Repo } from "./repo";


@Entity('contribution')
export class Contribution{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"varchar"
    })
    githubId:string;

    @Column({
        type:"varchar"
    })
    name:string;

    @Column({
        type:"varchar"
    })
    picLink:string;

    @Column({
        type:"numeric"
    })
    contributions:number

    @Column({
        type:"varchar"
    })
    profile_link:string

    @ManyToOne(
        () => Repo,
        repo => repo.contributions
    )
    @JoinColumn({
        name:"repoId"
    })
    repo:Repo
}