import {
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  styled,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Coffee as CoffeeIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Power as PowerIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Terminal as TerminalIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import React from 'react';
import { drawerWidth } from '../core/theme';

const mainListItems = [
  { icon: <DashboardIcon />, text: 'Dashboard', link: '/dashboard' },
  { icon: <TerminalIcon />, text: 'Console', link: '/console' },
  { icon: <CoffeeIcon />, text: 'Jars', link: '/jars' },
  { icon: <PowerIcon />, text: 'Plugins', link: '/plugins' },
  { icon: <SettingsIcon />, text: 'Configuration', link: '/configuration' },
  { icon: <StorageIcon />, text: 'Servers', link: '/servers' },
];

const secondaryListItems = [
  { icon: <DescriptionIcon />, text: 'Current month' },
  { icon: <DescriptionIcon />, text: 'Last quarter' },
  { icon: <DescriptionIcon />, text: 'Year-end sale' },
];

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface Props {
  open: boolean;
  toggleDrawer: () => void;
}

export const Drawer: React.FC<Props> = ({ open, toggleDrawer }) => (
  <StyledDrawer variant="permanent" open={open}>
    <Toolbar
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
      }}>
      <IconButton onClick={toggleDrawer}>
        <ChevronLeftIcon />
      </IconButton>
    </Toolbar>

    <Divider />

    <List component="nav">
      {mainListItems.map((item, index) => (
        <Link
          to={item.link}
          key={index}
          style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </Link>
      ))}

      <Divider sx={{ my: 1 }} />

      <ListSubheader inset>Configs</ListSubheader>
      {secondaryListItems.map((item, index) => (
        <ListItem button key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </StyledDrawer>
);

export default Drawer;
