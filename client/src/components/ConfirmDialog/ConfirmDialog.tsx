import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import useLocales from '../../hooks/useLocale';

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    executeAction: () => void;
};

const ConfirmDialog = ({
    open,
    onClose,
    executeAction,
}: ConfirmDialogProps): JSX.Element => {
    const { translate } = useLocales();
    const handleAction = async () => {
        executeAction();
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    {translate('general.confirm_dialog.are_you_sure')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate(
                            'general.confirm_dialog.operation_cannot_be_undone'
                        )}!
                    </DialogContentText>
                    <DialogActions sx={{ mt: 5 }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                        >
                            {translate('general.confirm_dialog.cancel')}
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                handleAction();
                                onClose();
                            }}
                        >
                            {translate('general.confirm_dialog.yes')}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConfirmDialog;
