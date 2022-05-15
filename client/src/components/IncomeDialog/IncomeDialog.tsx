import { Icon } from '@iconify/react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import useLocales from '../../hooks/useLocale';
import IncomeContainer from '../../containers/Income/IncomeContainer';
import Income from '../../models/Income';
import { Dispatch, SetStateAction } from 'react';

type IncomeDialogProps = {
    currentIncome?: Income;
    setCurrentIncome?: Dispatch<SetStateAction<Income | undefined>>;
    open: boolean;
    onClose: () => void;
};

const IncomeDialog = ({
    open,
    onClose,
    currentIncome,
    setCurrentIncome,
}: IncomeDialogProps): JSX.Element => {
    const { translate } = useLocales();
    const {
        amount,
        setAmount,
        handleAddIncomeSubmit,
        handleUpdateIncome,
        amountError,
    } = IncomeContainer();

    const handleAction = async () => {
        try {
            const submission = currentIncome
                ? await handleUpdateIncome(currentIncome.id, currentIncome)
                : await handleAddIncomeSubmit();

            if (submission) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth="xs"
                open={open}
                onClose={() => {
                    onClose();
                    setAmount('');
                }}
                PaperProps={{
                    style: { borderRadius: 15 },
                }}
            >
                <DialogTitle>
                    <Box flexDirection="row" justifyContent="space-between">
                        <Box>
                            <Typography variant="h5" color="secondary">
                                {currentIncome
                                    ? translate(
                                          'general.incomes_page.edit_income'
                                      )
                                    : translate('general.home_page.add_income')}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton
                                onClick={() => {
                                    onClose();
                                    setAmount('');
                                }}
                                sx={{
                                    position: 'absolute',
                                    right: 20,
                                    top: 10,
                                    zIndex: 2,
                                }}
                            >
                                <Icon
                                    icon={closeFill}
                                    width={30}
                                    height={30}
                                    color="black"
                                />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <TextField
                        required
                        fullWidth
                        sx={{ mt: 5 }}
                        label={translate('general.home_page.amount')}
                        color="secondary"
                        size="medium"
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        value={
                            currentIncome
                                ? String(currentIncome.amount)
                                : amount
                        }
                        onChange={(e) =>
                            currentIncome && setCurrentIncome
                                ? setCurrentIncome({
                                      ...currentIncome,
                                      amount: Number(e.target.value),
                                  })
                                : setAmount(e.target.value)
                        }
                        error={amountError.amount !== undefined}
                        helperText={amountError.amount}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAction}
                    >
                        {currentIncome
                            ? translate('general.profile_page.edit')
                            : translate('general.home_page.add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default IncomeDialog;
