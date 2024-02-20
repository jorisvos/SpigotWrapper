import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '.5em',
  },
}));
