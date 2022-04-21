import { alpha, styled } from '@mui/material/styles';
import { Popover, PopoverProps } from '@mui/material';

const ArrowStyle = styled('span')(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        top: -7,
        zIndex: 1,
        width: 12,
        right: 20,
        height: 12,
        content: "''",
        position: 'absolute',
        borderRadius: '0 0 4px 0',
        transform: 'rotate(-135deg)',
        background: theme.palette.background.paper,
        borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    },
}));

const MenuPopover = ({ children, sx, ...other }: PopoverProps): JSX.Element => {
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    mt: 1.5,
                    ml: 0.5,
                    overflow: 'inherit',
                    boxShadow:
                        '0 0 2px 0 alpha(#919EAB, 0.24), 0 20px 40px -4px alpha(#919EAB, 0.24)',
                    border: 'solid 1px solid #919EAB',
                    width: 200,
                    ...sx,
                },
            }}
            {...other}
        >
            <ArrowStyle />
            {children}
        </Popover>
    );
};

export default MenuPopover;
