import { Column, Entity, OneToMany } from "typeorm";
import { Org } from "./org";
import { Base} from "./utils/base";

@Entity('repo') 
export class Repo extends Base{
    
    @OneToMany(() => Org, (org) => org.repos)
    org: Org
    
}