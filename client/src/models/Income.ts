import EntityBase from './EntityBase';
import User from './User';

interface Income extends EntityBase {
    user?: User | null;
    userId: string;
    amount: number;
}

export default Income;
