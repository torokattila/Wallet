import PurchaseCategory from '../../../enums/PurchaseCategory';

interface PurchasePayload {
    amount: number;
    category: string;
    userId: string;
}

export default PurchasePayload;
