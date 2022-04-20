import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingScreen = (): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
            }}
        >
            <CircularProgress size={180} color="secondary" />
        </Box>
    );
};

export default LoadingScreen;
