import { Entity,Column } from "typeorm";
import { Base} from "./utils/base";

@Entity('org') 
export class Org extends Base{

    @Column({
        type:"numeric"
    })
    totalRepos:number

    @Column({
        type:"json"
    }
    )
    totalRepoList:object
}