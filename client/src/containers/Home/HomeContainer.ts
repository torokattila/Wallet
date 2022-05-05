import { useState } from 'react';

const HomeContainer = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return {
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
    };
};

export default HomeContainer;
