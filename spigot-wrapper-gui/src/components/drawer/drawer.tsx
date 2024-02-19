import {
  Divider,
  Drawer as DrawerMUI,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
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
} from '@mui/icons-material';
import React from 'react';
import { useStyles } from './styles';

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

export const Drawer = () => {
  const classes = useStyles();

  return (
    <DrawerMUI variant="permanent" classes={{ paper: classes.drawerPaper }}>
      <Toolbar className={classes.drawerHeader}>
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          SpigotWrapper
        </Typography>
      </Toolbar>
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
