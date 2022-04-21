import React, { Suspense } from 'react';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

const Loadable = (Component: React.ElementType) => (props: any) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable;
