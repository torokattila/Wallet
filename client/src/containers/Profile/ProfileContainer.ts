import { useSnackbar } from "notistack";
import useLocales from "../../hooks/useLocale";

const ProfileContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
}

export default ProfileContainer;