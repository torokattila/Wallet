enum PurchaseCategory {
    FOOD = 'food',
    CLOTHING = 'clothing',
    ENTERTAINMENT = 'entertainment',
    OTHER = 'other',
}

export const PurchaseCategoryHU = {
    [PurchaseCategory.FOOD]: 'Élelmiszer',
    [PurchaseCategory.CLOTHING]: 'Ruházat',
    [PurchaseCategory.ENTERTAINMENT]: 'Szórakozás',
    [PurchaseCategory.OTHER]: 'Egyéb',
};

export const PurchaseCategoryEN = {
    [PurchaseCategory.FOOD]: 'Food',
    [PurchaseCategory.CLOTHING]: 'Clothing',
    [PurchaseCategory.ENTERTAINMENT]: 'Entertainment',
    [PurchaseCategory.OTHER]: 'Other',
};

export default PurchaseCategory;
