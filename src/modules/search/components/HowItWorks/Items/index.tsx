import React, { FC } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import OneItem from './OneItem';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 5,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 30,
  },
}));

const Items: FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('search', 'Items');

  const steps = [
    {
      title: t('find'),
      description: t('findDesc'),
    },
    {
      title: t('book'),
      description: t('bookDesc'),
    },
    {
      title: t('move'),
      description: t('moveDesc'),
    },

  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        {steps.map((step, i) => (
          <Box key={i}>
            <OneItem title={step.title} description={step.description} stepId={i + 1} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Items;
