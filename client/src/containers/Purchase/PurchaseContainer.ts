import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import PurchaseCategory from '../../enums/PurchaseCategory';
import useApi from '../../hooks/useApi';
import Purchase from '../../models/Purchase';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocale';
import PurchasePayload from '../../api/payloads/Home/PurchasePayload';
import LocalStorageManager from '../../utils/LocalStorageManager';
import HomeContainer from '../Home/HomeContainer';

const PurchaseContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const apiClient = useApi();

    const user = LocalStorageManager.getUser();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [openPurchaseDialog, setOpenPurchaseDialog] =
        useState<boolean>(false);
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [purchaseErrors, setPurchaseErrors] = useState<{
        [key: string]: string;
    }>({});

    const { refetch } = HomeContainer();

    const { data: purchaseList, refetch: refetchPurchases } = useQuery(
        'listPurchases',
        async () => {
            const result = await apiClient.listPurchases();
            setPurchases(result.purchases);
            return result;
        }
    );

    const handleOpenPurchaseDialog = () => {
        setOpenPurchaseDialog(true);
    };

    const handleClosePurchaseDialog = () => {
        setOpenPurchaseDialog(false);
    };

    const PurchaseSchema = Yup.object().shape({
        category: Yup.string().required(
            translate('general.home_page.category_required')
        ),
        amount: Yup.string().required(
            translate('general.home_page.amount_required')
        ),
    });

    const newPurchase: PurchasePayload = {
        category,
        amount: Number(amount),
        userId: user ? user.id : '',
    };

    const verifyNewPurchaseForm = async (): Promise<boolean> => {
        try {
            await PurchaseSchema.validate(newPurchase, { abortEarly: false });
            setPurchaseErrors({});

            if (newPurchase.amount === 0) {
                setPurchaseErrors({
                    ...purchaseErrors,
                    amount: translate('general.home_page.amount_required'),
                });

                return Promise.resolve(false);
            }

            return Promise.resolve(true);
        } catch (error: any) {
            const newErrors: { [key: string]: string } = {};

            for (const err of error.inner) {
                newErrors[err.path] = err.message;
            }

            setPurchaseErrors(newErrors);
            return Promise.resolve(false);
        }
    };

    const postPurchase = useMutation(async (payload: PurchasePayload) => {
        const purchase = await apiClient.postPurchase(payload);
        return purchase;
    });

    const handleNewPurchaseSubmit = async (): Promise<boolean> => {
        const payload: PurchasePayload = newPurchase;

        const isVerified = await verifyNewPurchaseForm();

        if (isVerified) {
            try {
                await postPurchase.mutateAsync(payload);

                refetchPurchases();
                refetch();
                setAmount('');
                setCategory('');

                const key = enqueueSnackbar(
                    translate('general.home_page.successful_purchase_creation'),
                    {
                        variant: 'success',
                        onClick: () => {
                            closeSnackbar(key);
                        },
                    }
                );

                return true;
            } catch (error) {
                return false;
            }
        } else {
            const key = enqueueSnackbar(
                translate('general.profile_page.validation_error'),
                {
                    variant: 'error',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
            return false;
        }
    };

    return {
        purchaseList,
        refetchPurchases,
        openPurchaseDialog,
        handleOpenPurchaseDialog,
        handleClosePurchaseDialog,
        category,
        setCategory,
        amount,
        setAmount,
        purchaseErrors,
        handleNewPurchaseSubmit,
    };
};

export default PurchaseContainer;
