import { Column, Entity, OneToMany } from 'typeorm';
import EntityBase from './EntityBase';
import Income from './Income';
import Purchase from './Purchase';

@Entity({ name: 'users' })
export default class User extends EntityBase {
    @Column({ name: 'google_id', nullable: true })
    googleId: string;

    @Column({ unique: true })
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ nullable: true })
    password: string;

    @Column({ default: 0 })
    balance: number;

    @OneToMany(() => Purchase, (purchase) => purchase.user)
    purchases: Purchase[];

    @OneToMany(() => Income, (income) => income.user)
    incomes: Income[];
}
