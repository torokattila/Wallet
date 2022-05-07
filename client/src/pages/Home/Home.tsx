import {
    Box,
    Button,
    Card,
    Stack,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import useLocales from '../../hooks/useLocale';
import LocalStorageManager from '../../utils/LocalStorageManager';
import CurrencyFormat from 'react-currency-format';

import './Home.css';
import HomeContainer from '../../containers/Home/HomeContainer';
import IncomeDialog from '../../components/IncomeDialog/IncomeDialog';

const Home = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const user = LocalStorageManager.getUser();

    const {
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        handleAddIncomeSubmit,
    } = HomeContainer();

    return (
        <div className="home-container">
            <DrawerLayout>
                <Stack sx={{ maxWidth: matches ? '50%' : '100%' }}>
                    <Card sx={{ p: 4, borderRadius: '20px', mt: 5 }}>
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
                                <Typography variant="subtitle2" fontSize={20}>
                                    {translate('general.home_page.balance')}:
                                </Typography>
                                <Stack
                                    flexDirection={matches ? 'row' : 'column'}
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h5" color="secondary">
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
                                        onClick={handleOpenDialog}
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
            </DrawerLayout>
            <IncomeDialog
                open={openDialog}
                onClose={handleCloseDialog}
                executeAction={handleAddIncomeSubmit}
            />
        </div>
    );
};

export default Home;
