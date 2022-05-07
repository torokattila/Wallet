import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import IncomePayload from '../../api/payloads/Home/IncomePayload';
import useApi from '../../hooks/useApi';
import useLocales from '../../hooks/useLocale';
import LocalStorageManager from '../../utils/LocalStorageManager';

const HomeContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const apiClient = useApi();
    const { translate } = useLocales();
    const user = LocalStorageManager.getUser();

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<{
        [key: string]: string;
    }>({});

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const IncomeSchema = Yup.object().shape({
        amount: Yup.number().required(
            translate('general.home_page.amount_required')
        ),
    });

    const newIncome: IncomePayload = {
        amount: Number(amount),
        userId: user ? user.id : '',
    };

    const verifyNewIncomeForm = async (): Promise<boolean> => {
        try {
            await IncomeSchema.validate(newIncome, { abortEarly: false });
            setAmountError({});

            return Promise.resolve(true);
        } catch (error: any) {
            const newError: { [key: string]: string } = {};

            for (const err of error.inner) {
                newError[err.path] = err.message;
            }

            setAmountError(newError);
            return Promise.resolve(false);
        }
    };

    const postIncome = useMutation(async (payload: IncomePayload) => {
        const income = await apiClient.postIncome(payload);
        return income;
    });

    const handleAddIncomeSubmit = async () => {
        const payload: IncomePayload = newIncome;

        const isVerified = await verifyNewIncomeForm();

        if (isVerified) {
            try {
                // await postIncome.mutateAsync(payload);
                handleCloseDialog();
            } catch (error: any) {}
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
        }
    };

    return {
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        amount,
        setAmount,
        verifyNewIncomeForm,
        handleAddIncomeSubmit,
    };
};

export default HomeContainer;
