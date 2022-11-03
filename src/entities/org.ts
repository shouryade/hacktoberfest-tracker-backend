import { Entity,Column, OneToMany } from "typeorm";
import { Repo } from "./repo";
import { Base} from "./utils/base";

@Entity('org') 
export class Org extends Base{

    @Column({
        type:"numeric",
        default:0
    })
    totalRepos:number

    @Column({
        type:"json",
        default:null
    })
    totalRepoList:object

    @OneToMany(() => Repo,(repo) => repo.org)
    repos: Repo[]
}