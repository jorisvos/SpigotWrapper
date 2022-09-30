import clsx from 'clsx';
import {
  Divider,
  Drawer as DrawerMUI,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ChevronLeft as ChevronLeftIcon,
  Coffee as CoffeeIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Power as PowerIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Terminal as TerminalIcon,
} from '@mui/icons-material';
import React from 'react';
import { useStyles } from './styles';

interface Props {
  open: boolean;
  toggleDrawer: () => void;
}

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

export const Drawer: React.FC<Props> = ({ open, toggleDrawer }) => {
  const classes = useStyles();

  return (
    <DrawerMUI
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}>
      <div className={classes.toolbarIcon}>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <div>
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
        </div>
      </List>
      <Divider />
      <List>
        <div>
          <ListSubheader inset>Configs</ListSubheader>
          {secondaryListItems.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </div>
      </List>
    </DrawerMUI>
  );
};

export default Drawer;
