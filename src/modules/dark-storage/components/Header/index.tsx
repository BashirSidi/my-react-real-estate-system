import React, { FC } from 'react';
import {
  Box, makeStyles, Typography,
} from '@material-ui/core';
import usePageTranslation from '../../../../hooks/usePageTranslation';

interface HeaderProps {
  content: string;
}

const useStyles = makeStyles((theme) => ({
  header: {
    padding: '0 27px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '30px',
      padding: 0,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '20px',
      padding: 0,
    },
  },
  title: {
    color: '#070707',
    fontStyle: 'normal',
    [theme.breakpoints.up('md')]: {
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '35px',
    },
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '20px',
  },
  description: {
    width: '80%',
    color: '#070707',
    margin: '15px 0',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    [theme.breakpoints.up('md')]: {
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '30px',
    },
  },
  divider: {
    margin: '25px 0',
    [theme.breakpoints.up('md')]: {
      margin: '50px 0',
    },
  },
}));

const Header = ({ content }: HeaderProps) => {
  const classes = useStyles();
  const { t } = usePageTranslation('darkStorage', content);

  return (
    <Box className={classes.header}>
      <Typography variant="h1" className={classes.title}>
        {t('title')}
      </Typography>
      <Typography variant="h3" className={classes.description}>
        {t('content')}
      </Typography>
    </Box>
  );
};

export default Header;
