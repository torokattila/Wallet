import Currency from '../enums/Currency';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import EntityBase from './EntityBase';
import User from './User';

@Entity({ name: 'purchases' })
export default class Purchase extends EntityBase {
    @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE', cascade: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: Currency,
        default: Currency.HUF,
    })
    currency: Currency;
}
