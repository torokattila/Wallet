import EntityBase from './EntityBase';
import Income from './Income';
import Purchase from './Purchase';

interface User extends EntityBase {
    googleId?: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    balance: number;
    purchases?: Purchase[];
    incomes?: Income[];
}

export default User;
