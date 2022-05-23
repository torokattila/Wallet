import {
    Autocomplete,
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
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import useLocales from '../../hooks/useLocale';
import { useTheme } from '@mui/material/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import 'moment/locale/hu';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';

import './Purchases.css';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import PurchaseContainer from '../../containers/Purchase/PurchaseContainer';
import PurchaseCategory from '../../enums/PurchaseCategory';
import Purchase from '../../models/Purchase';
import PurchaseDialog from '../../components/PurchaseDialog/PurchaseDialog';
import DeleteEntityDialog from '../../components/DeleteEntityDialog/DeleteEntityDialog';
import CurrencyFormat from 'react-currency-format';

const Purchases = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    const {
        from,
        setFrom,
        to,
        setTo,
        filterCategory,
        setFilterCategory,
        purchaseList,
        PaginationComponent,
        handleOpenDeleteDialog,
        handleOpenPurchaseDialog,
        purchaseDialogProps,
        deleteDialogOptions,
        downloadExcel,
    } = PurchaseContainer();

    return (
        <div className="purchases-container">
            <DrawerLayout>
                <Container
                    maxWidth="lg"
                    className="purchases-blurred-container"
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
                                    {translate('general.sidebar.purchases')}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
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
                                        alignItems={
                                            matches ? 'center' : 'normal'
                                        }
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
                                                    views={[
                                                        'year',
                                                        'month',
                                                        'day',
                                                    ]}
                                                    inputFormat="YYYY-MM-DD"
                                                    onChange={(newValue) =>
                                                        setFrom(newValue)
                                                    }
                                                    value={moment(from) || null}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
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
                                                    views={[
                                                        'year',
                                                        'month',
                                                        'day',
                                                    ]}
                                                    inputFormat="YYYY-MM-DD"
                                                    onChange={(newValue) =>
                                                        setTo(newValue)
                                                    }
                                                    value={moment(to) || null}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            fullWidth
                                                            type="date"
                                                            color="secondary"
                                                            {...params}
                                                            error={false}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>

                                            <Autocomplete
                                                fullWidth
                                                options={Object.values(
                                                    PurchaseCategory
                                                )}
                                                value={filterCategory}
                                                onChange={(e, v) =>
                                                    setFilterCategory(
                                                        v ? v : ''
                                                    )
                                                }
                                                getOptionLabel={(
                                                    option: string
                                                ) =>
                                                    option !== ''
                                                        ? translate(
                                                              `general.home_page.${option}`
                                                          )
                                                        : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        color="secondary"
                                                        {...params}
                                                        label={translate(
                                                            'general.home_page.category'
                                                        )}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Stack>
                                </Card>
                            </Stack>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                        purchaseList &&
                                        purchaseList.purchases &&
                                        purchaseList.purchases.length > 0
                                            ? downloadExcel()
                                            : null
                                    }
                                >
                                    {translate('general.download_result')}
                                </Button>
                            </Box>

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
                                                            'general.home_page.category'
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
                                            {purchaseList &&
                                                purchaseList.purchases &&
                                                purchaseList.purchases.map(
                                                    (purchase: Purchase) => (
                                                        <TableRow
                                                            key={purchase.id}
                                                        >
                                                            <TableCell align="center">
                                                                {purchase.category ===
                                                                PurchaseCategory.FOOD ? (
                                                                    <FastfoodIcon
                                                                        color="secondary"
                                                                        sx={{
                                                                            fontSize: 30,
                                                                        }}
                                                                    />
                                                                ) : purchase.category ===
                                                                  PurchaseCategory.CLOTHING ? (
                                                                    <CheckroomIcon
                                                                        color="secondary"
                                                                        sx={{
                                                                            fontSize: 30,
                                                                        }}
                                                                    />
                                                                ) : purchase.category ===
                                                                  PurchaseCategory.ENTERTAINMENT ? (
                                                                    <LocalBarIcon
                                                                        color="secondary"
                                                                        sx={{
                                                                            fontSize: 30,
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <AddCardOutlinedIcon
                                                                        color="secondary"
                                                                        sx={{
                                                                            fontSize: 30,
                                                                        }}
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body1">
                                                                    {translate(
                                                                        `general.home_page.${purchase.category}`
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body1">
                                                                    <CurrencyFormat
                                                                        value={
                                                                            purchase.amount
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
                                                                        purchase.created
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
                                                                                handleOpenPurchaseDialog(
                                                                                    purchase
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
                                                                            handleOpenDeleteDialog(
                                                                                purchase
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

export default Purchases;
