import React, { FC } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import Items from 'modules/search/components/HowItWorks/Items';
import usePageTranslation from '../../../../hooks/usePageTranslation';

const useStyles = makeStyles(() => ({
  root: {
    margin: '28px 24px 34px',
    paddingBottom: 22,
  },
  headerBox: {
    marginBottom: 25,
  },
  header: {
    fontSize: '1.6rem',
  },
}));

const HowItWorks: FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('search', 'HowItWorks');
  return (
    <Box className={classes.root}>
      <Box className={classes.headerBox}>
        <Typography variant="h2" className={classes.header}>
          {t('h2')}
        </Typography>
      </Box>
      <Items />
    </Box>
  );
};

export default HowItWorks;
