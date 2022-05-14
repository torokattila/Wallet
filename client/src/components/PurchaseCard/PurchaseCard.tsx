import {
    Box,
    Card,
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from '../../hooks/useLocale';
import Purchase from '../../models/Purchase';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import PurchaseCategory from '../../enums/PurchaseCategory';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

type PurchaseCardProps = {
    purchase: Purchase;
    onDelete: (purchase: Purchase) => void;
    onUpdate: (purchase: Purchase) => void;
};

const PurchaseCard = ({
    purchase,
    onDelete,
    onUpdate,
}: PurchaseCardProps): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <Card
            sx={{
                p: 5,
                m: 4,
                borderRadius: '20px',
                width: matches ? '13vw' : '60vw',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                alignItems="center"
            >
                {purchase.category === PurchaseCategory.FOOD ? (
                    <FastfoodIcon color="secondary" sx={{ fontSize: 70 }} />
                ) : purchase.category === PurchaseCategory.CLOTHING ? (
                    <CheckroomIcon color="secondary" sx={{ fontSize: 70 }} />
                ) : purchase.category === PurchaseCategory.ENTERTAINMENT ? (
                    <LocalBarIcon color="secondary" sx={{ fontSize: 70 }} />
                ) : (
                    <AddCardOutlinedIcon
                        color="secondary"
                        sx={{ fontSize: 70 }}
                    />
                )}

                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 'bold',
                        mt: 3,
                    }}
                >
                    {translate(`general.home_page.${purchase.category}`)}
                </Typography>

                <Typography
                    variant="h5"
                    color="secondary"
                    sx={{
                        fontWeight: 'bold',
                        mt: 3,
                    }}
                >
                    <CurrencyFormat
                        value={purchase.amount}
                        thousandSeparator={true}
                        displayType="text"
                        suffix=" Ft"
                    />
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 'bold',
                        mt: 3,
                    }}
                >
                    {moment(purchase.created).format('YYYY-MM-DD HH:mm')}
                </Typography>

                <Box>
                    <Tooltip arrow title={translate('general.edit')}>
                        <IconButton
                            sx={{ mt: 5 }}
                            onClick={() => onUpdate(purchase)}
                        >
                            <EditIcon color="secondary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title={translate('general.delete')}>
                        <IconButton
                            sx={{ mt: 5 }}
                            onClick={() => onDelete(purchase)}
                        >
                            <DeleteOutlineIcon
                                color="secondary"
                                fontSize="large"
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Card>
    );
};

export default PurchaseCard;
