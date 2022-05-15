import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from 'react-query';
import useApi from '../../hooks/useApi';
import useLocales from '../../hooks/useLocale';
import { IncomeList } from '../../api/ApiClient';
import { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import * as Yup from 'yup';
import IncomePayload from '../../api/payloads/Home/IncomePayload';
import HomeContainer from '../Home/HomeContainer';
import Income from '../../models/Income';
import { Moment } from 'moment';
import { DateRange } from '@mui/lab';

const IncomeContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const apiClient = useApi();

    const [openIncomeDialog, setOpenIncomeDialog] = useState<boolean>(false);
    const [isDeleteIncomeDialogOpen, setIsDeleteIncomeDialogOpen] =
        useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');
    const [amountError, setAmountError] = useState<{
        [key: string]: string;
    }>({});
    const [page, setPage] = useState<number>(1);
    const [from, setFrom] = useState<Moment | null>(null);
    const [to, setTo] = useState<Moment | null>(null);
    const pageSize = 10;

    const [deletableIncome, setDeletableIncome] = useState<Income | null>(null);
    const [editableIncome, setEditableIncome] = useState<Income | undefined>(
        undefined
    );

    const { user, refetchUser } = HomeContainer();

    const { data: incomes, refetch: refetchIncomes } = useQuery<
        IncomeList | undefined
    >(
        'incomes',
        async () => {
            const incomes = await apiClient.listIncomes(
                page,
                pageSize,
                from?.toISOString(),
                to?.toISOString()
            );

            return incomes;
        },
        { refetchOnWindowFocus: false }
    );

    const handleDateSelect = async (
        ranges: DateRange<Moment>
    ): Promise<void> => {
        setFrom(ranges[0]);
        setTo(ranges[1]);
    };

    const handleOpenIncomeDialog = (income?: Income): void => {
        if (income) {
            setEditableIncome(income);
        }
        setOpenIncomeDialog(true);
    };

    const handleCloseIncomeDialog = (): void => {
        setOpenIncomeDialog(false);
    };

    const handleOpenDeleteIncomeDialog = (income: Income): void => {
        setDeletableIncome(income);
        setIsDeleteIncomeDialogOpen(true);
    };

    const handleCloseDeleteIncomeDialog = (): void => {
        setIsDeleteIncomeDialogOpen(false);
    };

    const handlePaginationChange = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const PaginationComponent =
        incomes && incomes.totalNumber ? (
            <Pagination
                count={Math.ceil(incomes.totalNumber / pageSize)}
                page={page}
                onChange={handlePaginationChange}
            />
        ) : null;

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

                refetchUser();
                refetchIncomes();

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

    const handleUpdateIncome = async (
        incomeId: string,
        income: Income
    ): Promise<boolean> => {
        try {
            await apiClient.updateIncome(incomeId, income);

            refetchIncomes();
            refetchUser();

            const key = enqueueSnackbar(
                translate('general.profile_page.successful_modification'),
                {
                    variant: 'success',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );

            return true;
        } catch (error: any) {
            const key = enqueueSnackbar(
                translate('general.profile_page.unsuccessful_modification'),
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

    const deleteIncome = useMutation(
        async (id: string) => await apiClient.deleteIncome(id)
    );

    const handleDeleteIncome = async () => {
        try {
            await deleteIncome.mutateAsync(deletableIncome?.id as string);
            refetchIncomes();
            refetchUser();

            const key = enqueueSnackbar(
                translate('general.home_page.successful_delete'),
                {
                    variant: 'success',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
        } catch (error: any) {
            const key = enqueueSnackbar(
                translate('general.home_page.delete_failed'),
                {
                    variant: 'error',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
        }
    };

    useEffect(() => {
        refetchIncomes();
    }, [page]);

    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }

        if (page === 1) {
            refetchIncomes();
        }
    }, [from, to]);

    const deleteDialogOptions = {
        currentEntity: deletableIncome,
        isOpen: isDeleteIncomeDialogOpen,
        onClose: handleCloseDeleteIncomeDialog,
        removeEntity: () => handleDeleteIncome(),
    };

    const incomeDialogProps = {
        currentIncome: editableIncome,
        setCurrentIncome: setEditableIncome,
        isOpen: openIncomeDialog,
        onClose: handleOpenIncomeDialog,
    };

    return {
        page,
        from,
        setFrom,
        to,
        setTo,
        pageSize,
        PaginationComponent,
        incomes,
        refetchIncomes,
        openIncomeDialog,
        setOpenIncomeDialog,
        handleOpenIncomeDialog,
        handleCloseIncomeDialog,
        amount,
        setAmount,
        verifyNewIncomeForm,
        handleAddIncomeSubmit,
        amountError,
        isDeleteIncomeDialogOpen,
        setIsDeleteIncomeDialogOpen,
        handleOpenDeleteIncomeDialog,
        handleCloseDeleteIncomeDialog,
        deletableIncome,
        setDeletableIncome,
        deleteDialogOptions,
        handleDateSelect,
        handleUpdateIncome,
        incomeDialogProps,
    };
};

export default IncomeContainer;
