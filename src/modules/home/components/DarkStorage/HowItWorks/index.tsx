import {
  Box, makeStyles, Typography, Hidden,
} from '@material-ui/core';
import React, { FC } from 'react';
import Image from '../../../../../components/Image';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const useStyles = makeStyles((theme) => ({
  title34: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333333',
    margin: '30px 0',
  },
  container: {
    margin: '30px 0',
    [theme.breakpoints.down('md')]: {
      margin: 0,
    },
  },
  cardHolder: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  card: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      gap: '2rem',
      flexDirection: 'column',
      marginBottom: 30,
    },
  },
  cardIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 153,
    height: 152,
    marginRight: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    border: '2px solid #E9E9E9',
    [theme.breakpoints.down('md')]: {
      margin: 0,
      width: 114,
      height: 114,
    },
  },
  cardNextIcon: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  },
  cardHeader: {
    display: 'grid',
    gridTemplateColumns: '153px 1fr',
    alignItems: 'center',
    justifyItems: 'start',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '114px 1fr',
    },
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    gap: 10,
    [theme.breakpoints.down('md')]: {
      marginTop: 10,
    },
  },
  cardStep: {
    color: '#EA5B21',
    fontSize: '3rem',
    fontWeight: 700,
    marginRight: 8,
    lineHeight: '10px',
    [theme.breakpoints.down('md')]: {
      fontSize: '2rem',
    },
  },
  cardTitle: {
    fontSize: '1.7rem',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.4rem',
      lineHeight: '14px',
    },
  },
  cardContent: {
    fontSize: '1.4rem',
    fontWeight: 400,
    lineHeight: '24px',
    paddingRight: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.2rem',
    },
  },
  section2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridGap: 20,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: '1fr',
      gridGap: 0,
    },
  },
}));

const HowItWorks: FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('home', 'DarkStorage');

  return (
    <Box className={classes.container}>
      <Box>
        <Typography className={classes.title34}>{t('title3')}</Typography>
      </Box>
      <Box className={classes.section2}>
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box className={classes.cardIcon}>
              <Image folder="Homepage" name="calendar" extension="svg" asInlineEl />
            </Box>
            <Box className={classes.cardNextIcon}>
              <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
            </Box>
          </Box>
          <Box className={classes.cardBody}>
            <Box display="flex" flexDirection="row">
              <Typography className={classes.cardStep}> 1 </Typography>
              <Typography className={classes.cardTitle}>{t('step1_title')}</Typography>
            </Box>
            <Box className={classes.cardContent}>{t('step1_content')}</Box>
          </Box>
        </Box>
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box className={classes.cardIcon}>
              <Image folder="Homepage" name="packIt" extension="svg" asInlineEl />
            </Box>
            <Hidden smDown>
              <Box className={classes.cardNextIcon}>
                <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
              </Box>
            </Hidden>
          </Box>
          <Box className={classes.cardBody}>
            <Box display="flex" flexDirection="row">
              <Typography className={classes.cardStep}> 2 </Typography>
              <Typography className={classes.cardTitle}>{t('step2_title')}</Typography>
            </Box>
            <Box className={classes.cardContent}>{t('step2_content')}</Box>
          </Box>
        </Box>
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Box className={classes.cardIcon}>
              <Image folder="Homepage" name="truck" extension="svg" asInlineEl />
            </Box>
            <Box className={classes.cardNextIcon}>
              <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
            </Box>
          </Box>
          <Box className={classes.cardBody}>
            <Box display="flex" flexDirection="row">
              <Typography className={classes.cardStep}> 3 </Typography>
              <Typography className={classes.cardTitle}>{t('step3_title')}</Typography>
            </Box>
            <Box className={classes.cardContent}>{t('step3_content')}</Box>
          </Box>
        </Box>
        <Box className={classes.card}>
          <Box display="flex" alignItems="center">
            <Box className={classes.cardIcon}>
              <Image folder="Homepage" name="store" extension="svg" asInlineEl />
            </Box>
          </Box>
          <Box className={classes.cardBody}>
            <Box display="flex" flexDirection="row">
              <Typography className={classes.cardStep}> 4 </Typography>
              <Typography className={classes.cardTitle}>{t('step4_title')}</Typography>
            </Box>
            <Box className={classes.cardContent}>{t('step4_content')}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorks;
