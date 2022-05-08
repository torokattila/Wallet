import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';
import IncomePayload from '../../api/payloads/Home/IncomePayload';
import useApi from '../../hooks/useApi';
import useLocales from '../../hooks/useLocale';

const HomeContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const apiClient = useApi();

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<{
        [key: string]: string;
    }>({});

    const { data: user, refetch } = useQuery(
        'getCurrentUser',
        async () => await apiClient.getCurrentUser(),
        {
            refetchOnWindowFocus: false,
        }
    );

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

            if (newIncome.amount === 0) {
                setAmountError({
                    amount: translate('general.home_page.amount_required'),
                });
                return Promise.resolve(false);
            }

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

    const handleAddIncomeSubmit = async (): Promise<boolean> => {
        const payload: IncomePayload = newIncome;

        const isVerified = await verifyNewIncomeForm();

        if (isVerified) {
            try {
                await postIncome.mutateAsync(payload);

                refetch();

                const key = enqueueSnackbar(
                    translate('general.home_page.successful_amount_creation'),
                    {
                        variant: 'success',
                        onClick: () => {
                            closeSnackbar(key);
                        },
                    }
                );

                setAmount('');

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
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        amount,
        setAmount,
        verifyNewIncomeForm,
        handleAddIncomeSubmit,
        amountError,
        refetch,
        user,
    };
};

export default HomeContainer;
