import {
  Box, makeStyles, Typography, Hidden,
} from '@material-ui/core';
import React, { FC } from 'react';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import Boxes from './Boxes';
import HowItWorks from './HowItWorks';

const useStyles = makeStyles((theme) => ({
  container: {
    overflowX: 'hidden',
    position: 'relative',
    backgroundColor: '#E9E9E988 !important',
    color: '#333333',
    [theme.breakpoints.down('xs')]: {
      padding: 25,
      marginTop: 25,
    },
    [theme.breakpoints.up('md')]: {
      padding: '50px 200px',
      marginBottom: '30px',
    },
  },
  header: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    display: 'flex',
    gap: 5,
  },
  title1: {
    fontSize: 34,
    margin: '0',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: '2.2rem',
      fontFamily: 'Poppins',
      fontWeight: 600,
      margin: 0,
    },
  },
  title2: {
    fontSize: 34,
    margin: '0',
    fontWeight: 600,
    color: '#EA5B21',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.2rem',
      fontFamily: 'Poppins',
      fontWeight: 600,
      marginLeft: 0,
      marginTop: 5,
    },
  },
  section1Image: {
    width: '100%',
    display: 'inline-block !important',
  },
  paragraph1: {
    fontSize: '1.4rem',
    lineHeight: '28px',
  },
  section1: {
    display: 'flex',
    alignItems: 'center',
    gridGap: '8rem',
    paddingTop: 15,
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      flexDirection: 'column',
    },
  },
}));

const DarkStorage: FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('home', 'DarkStorage');

  return (
    <Box className={classes.container}>
      <Box>
        <Box className={classes.header}>
          <Typography className={classes.title1} variant="h2">{t('title1')}</Typography>
          <Typography className={classes.title2} variant="h2">{t('title2')}</Typography>
        </Box>
        <Box className={classes.section1}>
          <Box className={classes.paragraph1}>{t('paragraph1')}</Box>
          <Hidden smDown>
            <Image folder="Homepage" name="storage" className={classes.section1Image} extension="svg" asInlineEl />
          </Hidden>
        </Box>
      </Box>
      <HowItWorks />
      <Boxes />
    </Box>
  );
};

export default DarkStorage;
