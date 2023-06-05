import {
  Box,
} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grey3Typography from '../../../../../components/Typographies/Grey3Typography';
import Grey2Typography from '../../../../../components/Typographies/Grey2Typography';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const useStyles = makeStyles((theme) => ({
  bodyTitleBox: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      margin: '0 20px',
    },
  },
  bodyTitleText: {
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: '30px',
    textAlign: 'center',
    color: '#333333',
    marginTop: '30px',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 600,
    },
  },
  bodyDescriptionBox: {
    display: 'flex',
    justifyContent: 'center',
    margin: '11px 0 28px',
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    color: '#989898',
    marginTop: '10px',
  },
  bodyDescriptionText: {
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
}));

const BodyText: React.FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('checkout', 'PromotionDialog');
  return (
    <>
      <Box className={classes.bodyTitleBox}>
        <Grey3Typography variant="h3" className={classes.bodyTitleText}>
          {t('typography2')}
        </Grey3Typography>
      </Box>
      <Box className={classes.bodyDescriptionBox}>
        <Grey2Typography variant="body1" className={classes.bodyDescriptionText}>
          {t('typography3')}
        </Grey2Typography>
      </Box>
    </>
  );
};

export default BodyText;
