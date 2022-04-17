import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import EntityBase from './EntityBase';
import User from './User';

@Entity({ name: 'incomes' })
export default class Income extends EntityBase {
    @ManyToOne(() => User, (user) => user.incomes, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    amount: number;
}
