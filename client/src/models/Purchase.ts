import PurchaseCategory from "../enums/PurchaseCategory";
import EntityBase from "./EntityBase";
import User from "./User";

interface Purchase extends EntityBase {
    user?: User | null;
    userId: string;
    amount: number;
    category: PurchaseCategory;
}

export default Purchase;
