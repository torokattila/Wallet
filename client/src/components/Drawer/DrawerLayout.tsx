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

import useLocales from '../../hooks/useLocale';
import { useNavigate } from 'react-router-dom';
import LanguagePopover from '../../layouts/LanguagePopover';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { useMediaQuery } from '@mui/material';

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
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

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
                        button
                        onClick={() => {
                            navigate('/');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <HomeOutlinedIcon color="secondary" />
                        </ListItemIcon>
                        <Typography color="secondary" variant="h6">
                            {translate('general.sidebar.home_page')}
                        </Typography>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        button
                        onClick={() => {
                            navigate('/profile');
                            handleDrawerClose();
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleOutlinedIcon color="secondary" />
                        </ListItemIcon>
                        <Typography color="secondary" variant="h6">
                            {translate('general.sidebar.profile')}
                        </Typography>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem
                        button
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
