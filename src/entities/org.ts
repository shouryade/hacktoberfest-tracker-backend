import { Entity,Column, OneToMany } from "typeorm";
import { Repo } from "./repo";
import { Base} from "./utils/base";

@Entity('org') 
export class Org extends Base{

    @Column({
        type:"varchar"
    })
    avatar_url:string

    @Column({
        type:"numeric",
        default:0
    })
    totalRepos:number

    @OneToMany(
        () => Repo,
        (repo) => repo.org
    )
    repos: Repo[]
}