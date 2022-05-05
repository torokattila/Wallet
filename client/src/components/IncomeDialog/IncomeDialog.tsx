import { Dialog } from '@mui/material';

type IncomeDialogProps = {
    open: boolean;
    onClose: () => void;
    executeAction: () => void;
};

const IncomeDialog = ({
    open,
    onClose,
    executeAction,
}: IncomeDialogProps): JSX.Element => {
    return (
        <div>
            <Dialog open={open} onClose={onClose}></Dialog>
        </div>
    );
};

export default IncomeDialog;
