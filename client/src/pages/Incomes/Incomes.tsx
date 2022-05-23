import {
    Box,
    Button,
    Card,
    Container,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/hu';
import DateAdapter from '@mui/lab/AdapterMoment';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import DrawerLayout from '../../components/Drawer/DrawerLayout';
import IncomeContainer from '../../containers/Income/IncomeContainer';
import useLocales from '../../hooks/useLocale';
import Income from '../../models/Income';

import './Incomes.css';
import IncomeDialog from '../../components/IncomeDialog/IncomeDialog';
import DeleteEntityDialog from '../../components/DeleteEntityDialog/DeleteEntityDialog';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import CurrencyFormat from 'react-currency-format';

const Incomes = (): JSX.Element => {
    const { translate } = useLocales();
    const {
        incomes,
        PaginationComponent,
        openIncomeDialog,
        handleCloseIncomeDialog,
        handleOpenIncomeDialog,
        deleteDialogOptions,
        handleOpenDeleteIncomeDialog,
        from,
        setFrom,
        to,
        setTo,
        incomeDialogProps,
    } = IncomeContainer();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <div className="incomes-container">
            <DrawerLayout>
                <Container
                    maxWidth="lg"
                    className="incomes-blurred-container"
                    sx={{ pb: 3 }}
                >
                    <Stack spacing={3}>
                        <Box
                            sx={{
                                p: 3,
                                mt: 3,
                                backgroundColor: 'white',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                borderRadius: '20px',
                                display: 'flex',
                                justifyContent: matches
                                    ? 'space-between'
                                    : 'center',
                                alignItems: 'center',
                                flexDirection: matches ? 'row' : 'column',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold' }}
                                    color="secondary"
                                >
                                    {translate('general.sidebar.incomes')}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: matches ? 0 : 5 }}
                                    onClick={() => handleOpenIncomeDialog()}
                                >
                                    {translate('general.home_page.add_income')}
                                </Button>
                            </Box>
                        </Box>

                        <>
                            <Stack alignItems={matches ? 'center' : 'normal'}>
                                <Card
                                    sx={{
                                        p: 3,
                                        borderRadius: '20px',
                                        boxShadow:
                                            '0 4px 30px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Stack
                                        spacing={2}
                                        justifyContent="center"
                                        direction={{
                                            xs: 'column',
                                            sm: 'row',
                                        }}
                                    >
                                        <LocalizationProvider
                                            dateAdapter={DateAdapter}
                                            locale={moment.locale()}
                                        >
                                            <DatePicker
                                                clearable
                                                clearText={translate(
                                                    'general.delete'
                                                )}
                                                disableFuture
                                                openTo="day"
                                                label={translate(
                                                    'general.filter_from'
                                                )}
                                                cancelText={translate(
                                                    'general.confirm_dialog.cancel'
                                                )}
                                                mask="____-__-__"
                                                views={['year', 'month', 'day']}
                                                inputFormat="YYYY-MM-DD"
                                                onChange={(newValue) =>
                                                    setFrom(newValue)
                                                }
                                                value={moment(from) || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        type="date"
                                                        color="secondary"
                                                        {...params}
                                                        error={false}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>

                                        <LocalizationProvider
                                            dateAdapter={DateAdapter}
                                            locale={moment.locale()}
                                        >
                                            <DatePicker
                                                clearable
                                                clearText={translate(
                                                    'general.delete'
                                                )}
                                                disableFuture
                                                openTo="day"
                                                label={translate(
                                                    'general.filter_to'
                                                )}
                                                cancelText={translate(
                                                    'general.confirm_dialog.cancel'
                                                )}
                                                mask="____-__-__"
                                                views={['year', 'month', 'day']}
                                                inputFormat="YYYY-MM-DD"
                                                onChange={(newValue) =>
                                                    setTo(newValue)
                                                }
                                                value={moment(to) || null}
                                                renderInput={(params) => (
                                                    <TextField
                                                        type="date"
                                                        color="secondary"
                                                        {...params}
                                                        error={false}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Card>
                            </Stack>

                            <Card
                                sx={{
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                    py: 2,
                                    borderRadius: '20px',
                                    mb: 2,
                                }}
                            >
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell align="center">
                                                    <Typography
                                                        variant="body1"
                                                        color="secondary"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {translate(
                                                            'general.home_page.amount'
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography
                                                        variant="body1"
                                                        color="secondary"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {translate(
                                                            'general.date'
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {incomes &&
                                                incomes.incomes &&
                                                incomes.incomes.map(
                                                    (income: Income) => (
                                                        <TableRow
                                                            key={income.id}
                                                        >
                                                            <TableCell></TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body1">
                                                                    <CurrencyFormat
                                                                        value={
                                                                            income.amount
                                                                        }
                                                                        thousandSeparator={
                                                                            true
                                                                        }
                                                                        displayType="text"
                                                                    />
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body1">
                                                                    {moment(
                                                                        income.created
                                                                    ).format(
                                                                        'YYYY-MM-DD HH:mm:ss'
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Tooltip
                                                                    arrow
                                                                    title={translate(
                                                                        'general.edit'
                                                                    )}
                                                                >
                                                                    <IconButton>
                                                                        <EditIcon
                                                                            onClick={() =>
                                                                                handleOpenIncomeDialog(
                                                                                    income
                                                                                )
                                                                            }
                                                                            color="secondary"
                                                                            fontSize="large"
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    arrow
                                                                    title={translate(
                                                                        'general.delete'
                                                                    )}
                                                                >
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleOpenDeleteIncomeDialog(
                                                                                income
                                                                            )
                                                                        }
                                                                    >
                                                                        <DeleteOutlineIcon
                                                                            color="secondary"
                                                                            fontSize="large"
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ py: { xs: 3, sm: 2 } }}
                                >
                                    {PaginationComponent}
                                </Box>
                            </Card>
                        </>
                    </Stack>
                </Container>
            </DrawerLayout>
            <IncomeDialog
                currentIncome={incomeDialogProps.currentIncome}
                setCurrentIncome={incomeDialogProps.setCurrentIncome}
                open={openIncomeDialog}
                onClose={handleCloseIncomeDialog}
            />
            <DeleteEntityDialog options={deleteDialogOptions} />
        </div>
    );
};

export default Incomes;
