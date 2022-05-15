import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import useLocales from '../../hooks/useLocale';
import CurrencyFormat from 'react-currency-format';

import './Home.css';
import HomeContainer from '../../containers/Home/HomeContainer';
import IncomeDialog from '../../components/IncomeDialog/IncomeDialog';
import PurchaseContainer from '../../containers/Purchase/PurchaseContainer';
import PurchaseDialog from '../../components/PurchaseDialog/PurchaseDialog';
import Purchase from '../../models/Purchase';

import PurchaseCard from '../../components/PurchaseCard/PurchaseCard';
import DeleteEntityDialog from '../../components/DeleteEntityDialog/DeleteEntityDialog';
import IncomeContainer from '../../containers/Income/IncomeContainer';

const Home = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    const { user } = HomeContainer();
    const {
        openIncomeDialog,
        setOpenIncomeDialog,
        handleOpenIncomeDialog,
        handleCloseIncomeDialog,
    } = IncomeContainer();
    const {
        purchaseList,
        handleOpenPurchaseDialog,
        handleOpenDeleteDialog,
        deleteDialogOptions,
        purchaseDialogProps,
    } = PurchaseContainer();

    return (
        <div className="home-container">
            <DrawerLayout>
                <Container maxWidth="xl" className="home-blurred-container">
                    <Stack sx={{ maxWidth: matches ? '50%' : '100%' }}>
                        <Card
                            sx={{
                                p: 4,
                                borderRadius: '20px',
                                mt: 5,
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Stack flexDirection="column" spacing={5}>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        color="secondary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Hello {user ? user.lastname : ''}!
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        fontSize={20}
                                    >
                                        {translate('general.home_page.balance')}
                                        :
                                    </Typography>
                                    <Stack
                                        flexDirection={
                                            matches ? 'row' : 'column'
                                        }
                                        justifyContent="space-between"
                                    >
                                        <Typography
                                            variant="h5"
                                            color="secondary"
                                        >
                                            <CurrencyFormat
                                                value={user && user.balance}
                                                thousandSeparator={true}
                                                displayType="text"
                                                suffix=" Ft"
                                            />
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            sx={{ mt: matches ? 0 : 5 }}
                                            onClick={() => handleOpenIncomeDialog()}
                                        >
                                            {translate(
                                                'general.home_page.add_income'
                                            )}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Card>
                    </Stack>

                    <Stack
                        spacing={3}
                        sx={{ p: 2, mt: 10 }}
                        alignItems="column"
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: matches
                                    ? 'space-between'
                                    : 'center',
                                alignItems: 'center',
                                flexDirection: matches ? 'row' : 'column',
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                    }}
                                    variant="h5"
                                    color="secondary"
                                >
                                    {translate(
                                        'general.home_page.last_five_purchases'
                                    )}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: matches ? 0 : 5 }}
                                    onClick={() => handleOpenPurchaseDialog()}
                                >
                                    {translate(
                                        'general.home_page.new_purchase'
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </Stack>

                    {purchaseList &&
                        purchaseList.purchases &&
                        purchaseList.purchases.length > 0 && (
                            <Stack
                                sx={{ mt: 2 }}
                                justifyContent="center"
                                flexDirection={matches ? 'row' : 'column'}
                                alignItems="center"
                            >
                                {purchaseList.purchases
                                    .slice(0, 5)
                                    .map((purchase: Purchase) => {
                                        return (
                                            <PurchaseCard
                                                onDelete={() =>
                                                    handleOpenDeleteDialog(
                                                        purchase
                                                    )
                                                }
                                                onUpdate={() =>
                                                    handleOpenPurchaseDialog(
                                                        purchase
                                                    )
                                                }
                                                purchase={purchase}
                                            />
                                        );
                                    })}
                            </Stack>
                        )}
                </Container>
            </DrawerLayout>
            <IncomeDialog
                open={openIncomeDialog}
                onClose={handleCloseIncomeDialog}
            />
            <PurchaseDialog
                currentPurchase={purchaseDialogProps.currentPurchase}
                setCurrentPurchase={purchaseDialogProps.setCurrentPurchase}
                open={purchaseDialogProps.isOpen}
                onClose={purchaseDialogProps.onClose}
            />
            <DeleteEntityDialog options={deleteDialogOptions} />
        </div>
    );
};

export default Home;
