import { BaseEntity,Column,Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Base extends BaseEntity {
    
    @PrimaryColumn()
    id:string

    
}