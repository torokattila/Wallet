import { useRef, useState } from 'react';
import { TFunction } from 'react-i18next';
import { Localization } from '@mui/material/locale';
import {
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import MenuPopover from '../components/MenuPopover/MenuPopover';

type LanguagePopoverProp = {
    onChangeLang: (newLang: string) => void;
    translate: TFunction<'translations'>;
    currentLang: {
        label: string;
        value: string;
        systemValue: Localization;
        icon: string;
    };
    allLang: {
        label: string;
        value: string;
        systemValue: Localization;
        icon: string;
    }[];
};

const LanguagePopover = ({
    onChangeLang,
    translate,
    currentLang,
    allLang,
}: LanguagePopoverProp): JSX.Element => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={() => setIsOpen(true)}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(isOpen && { bgcolor: 'action.selected' }),
                }}
            >
                <img src={currentLang.icon} alt={currentLang.label} />
            </IconButton>

            <MenuPopover
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchorEl={anchorRef.current}
            >
                <Box sx={{ py: 1 }}>
                    {allLang.map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === currentLang.value}
                            onClick={() => {
                                onChangeLang(option.value);
                                setIsOpen(false);
                            }}
                            sx={{ py: 1, px: 2.5 }}
                        >
                            <ListItemIcon>
                                <Box
                                    component="img"
                                    alt={option.label}
                                    src={option.icon}
                                />
                            </ListItemIcon>

                            <ListItemText
                                primaryTypographyProps={{ variant: 'body2' }}
                            >
                                {option.label}
                            </ListItemText>
                        </MenuItem>
                    ))}
                </Box>
            </MenuPopover>
        </>
    );
};

export default LanguagePopover;
