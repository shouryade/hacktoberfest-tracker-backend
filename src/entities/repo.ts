import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Contribution } from "./contribution";
import { Org } from "./org";
import { Base} from "./utils/base";

@Entity('repo') 
export class Repo extends Base{

    @Column({
        type:"simple-array"
    })
    topics:string[]

    @ManyToOne(
        () => Org, 
        (org) => org.repos
    )
    org: Org
    
    @OneToMany(
        () => Contribution,
        contribution => contribution.repo
    )
    contributions:Contribution[]
}