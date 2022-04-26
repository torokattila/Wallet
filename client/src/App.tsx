import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import useAuth from './hooks/useAuth';
import Router from './routes';
import './index.css';
import './fonts/NunitoSans-Regular.ttf';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: 'NunitoSans',
    },
});

function App() {
    const { isInitialized } = useAuth();
    const queryClient = new QueryClient();

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                {isInitialized ? <Router /> : <LoadingScreen />}
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
