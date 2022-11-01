import { BaseEntity,Column,Entity, PrimaryColumn } from "typeorm"

@Entity('base')
export class Base{
    
    @PrimaryColumn({
        type:"numeric"
    })
    id:number

    @Column({
        type:"varchar"
    })
    uName:string

    @Column({
        type:"numeric"
    })
    totalContributions:number

    @Column({
        type:"numeric"
    })
    totalCommits:number

    @Column({
        type:"numeric"
    })
    totalIssues:number

    @Column({
        type:"json"
    })
    contributorList:object

    @Column({
        type:"json"
    })
    issueList:object

    @Column({
        type:"json"
    })
    contributionList:object
}