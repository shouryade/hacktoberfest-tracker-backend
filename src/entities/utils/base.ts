import { BaseEntity,Column,Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity('base')
export class Base{
    
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar"
    })
    name:string

    @Column({
        type:"varchar"
    })
    uName:string

    @Column({
        type:"numeric",
        default:0
    })
    totalPrOpen:number

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
        type:"varchar"
    })
    url:string

    @Column({
        type:"longtext"
    })
    desc:string

}