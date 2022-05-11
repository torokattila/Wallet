import { Icon } from '@iconify/react';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import useLocales from '../../hooks/useLocale';
import PurchaseContainer from '../../containers/Purchase/PurchaseContainer';
import PurchaseCategory from '../../enums/PurchaseCategory';
import Purchase from '../../models/Purchase';
import { Dispatch, SetStateAction } from 'react';

type PurchaseDialogProps = {
    currentPurchase?: Purchase;
    setCurrentPurchase?: Dispatch<SetStateAction<Purchase | undefined>>;
    open: boolean;
    onClose: () => void;
};

const PurchaseDialog = ({
    currentPurchase,
    setCurrentPurchase,
    open,
    onClose,
}: PurchaseDialogProps): JSX.Element => {
    const { translate } = useLocales();
    const {
        category,
        setCategory,
        amount,
        setAmount,
        purchaseErrors,
        handleNewPurchaseSubmit,
        handleUpdatePurchase,
    } = PurchaseContainer();

    const handleAction = async () => {
        const submission = currentPurchase
            ? await handleUpdatePurchase(currentPurchase.id, currentPurchase)
            : await handleNewPurchaseSubmit();

        if (submission) {
            onClose();
        }
    };

    return (
        <div>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth="xs"
                onClose={() => {
                    onClose();
                    setCategory('');
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
                                {currentPurchase
                                    ? translate(
                                          'general.home_page.edit_purcase'
                                      )
                                    : translate(
                                          'general.home_page.new_purchase'
                                      )}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton
                                onClick={() => {
                                    onClose();
                                    setCategory('');
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
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Stack spacing={4} sx={{ mt: 5 }}>
                        <Autocomplete
                            fullWidth
                            options={Object.values(PurchaseCategory)}
                            value={
                                currentPurchase
                                    ? currentPurchase.category
                                    : category
                            }
                            onChange={(e, v) =>
                                currentPurchase && setCurrentPurchase
                                    ? setCurrentPurchase({
                                          ...currentPurchase,
                                          category: v as string,
                                      })
                                    : setCategory(v ? v : '')
                            }
                            getOptionLabel={(option: string) =>
                                option !== ''
                                    ? translate(`general.home_page.${option}`)
                                    : ''
                            }
                            renderInput={(params) => (
                                <TextField
                                    color="secondary"
                                    {...params}
                                    label={translate(
                                        'general.home_page.category'
                                    )}
                                    error={
                                        purchaseErrors.category !== undefined
                                    }
                                    helperText={purchaseErrors.category}
                                />
                            )}
                        />
                        <TextField
                            fullWidth={true}
                            label={translate('general.home_page.amount')}
                            color="secondary"
                            size="medium"
                            InputProps={{ inputProps: { min: 0 } }}
                            type="number"
                            value={
                                currentPurchase
                                    ? String(currentPurchase.amount)
                                    : amount
                            }
                            onChange={(e) =>
                                currentPurchase && setCurrentPurchase
                                    ? setCurrentPurchase({
                                          ...currentPurchase,
                                          amount: Number(e.target.value),
                                      })
                                    : setAmount(e.target.value)
                            }
                            error={purchaseErrors.amount !== undefined}
                            helperText={purchaseErrors.amount}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAction}
                    >
                        {currentPurchase
                            ? translate('general.profile_page.edit')
                            : translate('general.home_page.add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PurchaseDialog;
