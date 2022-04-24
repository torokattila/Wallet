import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import useAuth from './hooks/useAuth';
import Router from './routes';

function App() {
    const { isInitialized } = useAuth();
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {isInitialized ? <Router /> : <LoadingScreen />}
        </QueryClientProvider>
    );
}

export default App;
