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
import moment, { Moment } from 'moment';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import closeFill from '@iconify/icons-eva/close-fill';

import DrawerLayout from '../../components/Drawer/DrawerLayout';
import IncomeContainer from '../../containers/Income/IncomeContainer';
import useLocales from '../../hooks/useLocale';
import Income from '../../models/Income';

import './Incomes.css';
import IncomeDialog from '../../components/IncomeDialog/IncomeDialog';
import DeleteEntityDialog from '../../components/DeleteEntityDialog/DeleteEntityDialog';
import {
    DatePicker,
    DateRange,
    DateRangePicker,
    LocalizationProvider,
} from '@mui/lab';
import { Icon } from '@iconify/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

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
        handleDateSelect,
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
                                    onClick={handleOpenIncomeDialog}
                                >
                                    {translate('general.home_page.add_income')}
                                </Button>
                            </Box>
                        </Box>

                        <Card
                            sx={{
                                p: 3,
                                borderRadius: '20px',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Stack
                                spacing={2}
                                justifyContent="center"
                                direction={{ xs: 'column', sm: 'row' }}
                            >
                                <DatePicker
                                    disableFuture
                                    openTo="day"
                                    label="Dátumtól"
                                    mask="____/__/__"
                                    views={['year', 'month', 'day']}
                                    inputFormat="yyyy/MM/dd"
                                    onChange={(newValue) => setFrom(newValue)}
                                    value={moment(from)}
                                    renderInput={(params) => (
                                        <TextField
                                            type="date"
                                            color="secondary"
                                            {...params}
                                        />
                                    )}
                                />

                                <DatePicker
                                    disableFuture
                                    openTo="day"
                                    label="Dátumig"
                                    mask="____/__/__"
                                    views={['year', 'month', 'day']}
                                    inputFormat="yyyy/MM/dd"
                                    onChange={(newValue) => setTo(newValue)}
                                    value={moment(to)}
                                    renderInput={(params) => (
                                        <TextField
                                            type="date"
                                            color="secondary"
                                            {...params}
                                        />
                                    )}
                                />
                            </Stack>
                        </Card>

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
                                                    sx={{ fontWeight: 'bold' }}
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
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    {translate('general.date')}
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
                                                    <TableRow key={income.id}>
                                                        <TableCell></TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1">
                                                                {income.amount}
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
                    </Stack>
                </Container>
            </DrawerLayout>
            <IncomeDialog
                open={openIncomeDialog}
                onClose={handleCloseIncomeDialog}
            />
            <DeleteEntityDialog options={deleteDialogOptions} />
        </div>
    );
};

export default Incomes;
