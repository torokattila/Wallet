import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import useLocales from '../../hooks/useLocale';
import Income from '../../models/Income';
import Purchase from '../../models/Purchase';
import User from '../../models/User';

type OptionValue = User | Purchase | Income | null;

type Option<Type extends OptionValue> = {
    currentEntity: Type;
    isOpen: boolean;
    onClose: () => void;
    removeEntity: (id: string | undefined) => void;
};

type DeleteEntityDialogProps<Type extends OptionValue> = {
    options: Option<Type>;
};

const DeleteEntityDialog = <Type extends OptionValue>({
    options,
}: DeleteEntityDialogProps<Type>): JSX.Element => {
    const { translate } = useLocales();

    const handleDelete = async () => {
        options.removeEntity(
            options.currentEntity ? options.currentEntity.id : ''
        );
        options.onClose();
    };

    return (
        <div>
            <Dialog
                open={options.isOpen}
                onClose={options.onClose}
                PaperProps={{
                    style: { borderRadius: 15 },
                }}
            >
                <DialogTitle>
                    <Typography variant="h5" color="secondary">
                        {translate('general.confirm_dialog.are_you_sure')}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate(
                            'general.confirm_dialog.operation_cannot_be_undone'
                        )}
                        !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <DialogActions sx={{ mt: 5 }}>
                        <Button
                            onClick={options.onClose}
                            variant="outlined"
                            color="secondary"
                        >
                            {translate('general.confirm_dialog.cancel')}
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDelete}
                        >
                            {translate('general.confirm_dialog.yes')}
                        </Button>
                    </DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteEntityDialog;
