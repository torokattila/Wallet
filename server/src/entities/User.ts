import { Column, Entity, OneToMany } from "typeorm";
import EntityBase from "./EntityBase";
import Purchase from "./Purchase";

@Entity({ name: 'users' })
export default class User extends EntityBase {
    @Column({ name: 'google_id' })
    googleId: string;

    @Column()
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    password: string;

    @OneToMany(() => Purchase, (purchase) => purchase.user)
    purchases: Purchase[];
}