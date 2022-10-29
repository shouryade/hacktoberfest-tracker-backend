import { Entity,Column } from "typeorm";
import { Base} from "./utils/base";

@Entity('org') 
export class Org extends Base{

    @Column()
    totalRepos:number

    @Column()
    totalRepoList:object
}