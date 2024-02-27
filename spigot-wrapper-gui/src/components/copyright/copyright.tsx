import React from 'react';
import { Link, Typography, useTheme } from '@mui/material';

export const Copyright = () => {
  const theme = useTheme();

  return (
    <Typography sx={{ pt: 4, pb: 2 }} variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link
        href="https://github.com/jorisvos/spigotwrapper"
        style={{
          color: theme.palette.primary.main,
          textDecoration: 'inherit',
        }}>
        SpigotWrapper
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
