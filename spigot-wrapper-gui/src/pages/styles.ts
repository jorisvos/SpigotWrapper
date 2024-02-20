import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    paddingLeft: drawerWidth,
  },
  appBarSpacer: theme.mixins.toolbar,
}));
