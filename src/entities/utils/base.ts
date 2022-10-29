import { BaseEntity,Column,Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Base extends BaseEntity {
    
    @PrimaryColumn({})
    id:string

    @Column()
    totalContributions:number

    @Column()
    totalCommits:number

    @Column()
    totalIssues:number

    @Column()
    contributorList:object

    @Column()
    issueList:object

    @Column()
    contributionList:object
}