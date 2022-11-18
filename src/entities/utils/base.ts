import { BaseEntity,Column,Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity('base')
export class Base{
    
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar"
    })
    uName:string

    @Column({
        type:"numeric",
        default:0
    })
    totalContributions:number

    @Column({
        type:"numeric",
        default:0
    })
    totalCommits:number

    @Column({
        type:"numeric",
        default:0
    })
    totalIssues:number

    @Column({
        type:"json",
        default:null
    })
    contributorList:object

    @Column({
        type:"json",
        default:null
    })
    issueList:object

    @Column({
        type:"json",
        default:null
    })
    contributionList:object
}