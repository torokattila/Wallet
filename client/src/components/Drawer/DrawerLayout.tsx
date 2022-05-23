import React, { ReactNode, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';

import useLocales from '../../hooks/useLocale';
import { useNavigate } from 'react-router-dom';
import LanguagePopover from '../../layouts/LanguagePopover';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const DrawerLayout = ({ children }: { children: ReactNode }): JSX.Element => {
    const { onChangeLang, translate, currentLang, allLang } = useLocales();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const isHomePage = location.pathname === '/';
    const isProfilePage = location.pathname === '/profile';
    const isIncomesPage = location.pathname === '/incomes';
    const isPurchasesPage = location.pathname === '/purchases';

    const handleDrawerOpen = (): void => {
        setOpen(true);
    };

    const handleDrawerClose = (): void => {
        setOpen(false);
    };

    const handleLanguageChange = (value: string) => {
        onChangeLang(value);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar
                    sx={{
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                    }}
                >
                    <IconButton
                        color="secondary"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box>
                        <Typography></Typography>
                    </Box>

                    <Box
                        sx={{ display: 'flex' }}
                        alignItems="center"
                        flexDirection="row"
                    >
                        <Box sx={{ mr: 2 }}>
                            <LanguagePopover
                                allLang={allLang}
                                translate={translate}
                                currentLang={currentLang}
                                onChangeLang={handleLanguageChange}
                            />
                        </Box>
                        <Box>
                            <img
                                src="/wallet.png"
                                alt="wallet_logo"
                                style={{
                                    maxWidth: '70px',
                                    maxHeight: 'auto',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate('/')}
                            />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? (
                            <ChevronLeftIcon color="secondary" />
                        ) : (
                            <ChevronRightIcon color="secondary" />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem
                        sx={{
                            boxShadow: isHomePage
                                ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                                : '',
                            backgroundColor: isHomePage ? '#9c27b0' : '#fff',
                            transition: '0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: isHomePage ? '' : '#f1d2f7',
                                transition: '0.2s',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={() => {
                            navigate('/');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <HomeOutlinedIcon
                                sx={{ color: isHomePage ? '#fff' : '#9c27b0' }}
                            />
                        </ListItemIcon>
                        <Typography
                            sx={{ color: isHomePage ? '#fff' : '#9c27b0' }}
                            variant="h6"
                        >
                            {translate('general.sidebar.home_page')}
                        </Typography>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        sx={{
                            boxShadow: isIncomesPage
                                ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                                : '',
                            backgroundColor: isIncomesPage ? '#9c27b0' : '#fff',
                            transition: '0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: isIncomesPage ? '' : '#f1d2f7',
                                transition: '0.2s',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={() => {
                            navigate('/incomes');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <AddCardOutlinedIcon
                                sx={{
                                    color: isIncomesPage ? '#fff' : '#9c27b0',
                                }}
                            />
                        </ListItemIcon>
                        <Typography
                            sx={{ color: isIncomesPage ? '#fff' : '#9c27b0' }}
                            variant="h6"
                        >
                            {translate('general.sidebar.incomes')}
                        </Typography>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        sx={{
                            boxShadow: isPurchasesPage
                                ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                                : '',
                            backgroundColor: isPurchasesPage
                                ? '#9c27b0'
                                : '#fff',
                            transition: '0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: isPurchasesPage
                                    ? ''
                                    : '#f1d2f7',
                                transition: '0.2s',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={() => {
                            navigate('/purchases');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <ShoppingCartOutlinedIcon
                                sx={{
                                    color: isPurchasesPage ? '#fff' : '#9c27b0',
                                }}
                            />
                        </ListItemIcon>
                        <Typography
                            sx={{ color: isPurchasesPage ? '#fff' : '#9c27b0' }}
                            variant="h6"
                        >
                            {translate('general.sidebar.purchases')}
                        </Typography>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        sx={{
                            boxShadow: isProfilePage
                                ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                                : '',
                            backgroundColor: isProfilePage ? '#9c27b0' : '#fff',
                            transition: '0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: isProfilePage ? '' : '#f1d2f7',
                                transition: '0.2s',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={() => {
                            navigate('/profile');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon
                                sx={{
                                    color: isProfilePage ? '#fff' : '#9c27b0',
                                }}
                            />
                        </ListItemIcon>
                        <Typography
                            sx={{ color: isProfilePage ? '#fff' : '#9c27b0' }}
                            variant="h6"
                        >
                            {translate('general.sidebar.profile')}
                        </Typography>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem
                        sx={{
                            transition: '0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#f1d2f7',
                                transition: '0.2s',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                        onClick={() => {
                            LocalStorageManager.removeLocalStorage();
                            navigate('/login');
                        }}
                    >
                        <ListItemIcon>
                            <PowerSettingsNewIcon color="secondary" />
                        </ListItemIcon>
                        <Typography color="secondary" variant="h6">
                            {translate('general.sidebar.logout')}
                        </Typography>
                    </ListItem>
                </List>
            </Drawer>
            <Main sx={{ mt: matches ? '6%' : '20%', mb: '5%' }} open={open}>
                {children}
            </Main>
        </Box>
    );
};

export default DrawerLayout;
