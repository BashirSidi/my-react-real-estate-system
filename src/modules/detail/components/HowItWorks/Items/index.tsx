import { Box, makeStyles, Grid } from '@material-ui/core';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import OneItem from './OneItem';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  gridContainer: {
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between',
    },
  },
  box: {
    borderRadius: '15px',
    width: '90%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      boxShadow: 'none',
      borderRadius: 0,
      overflow: 'unset',
    },
  },
  itemGrid: {
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      maxWidth: '27%',
      [theme.breakpoints.up('xl')]: {
        maxWidth: '400px',
      },
    },
  },
}));

const Items: React.FC = () => {
  const classes = useStyles();
  const { t } = usePageTranslation('details', 'Items');
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
      <Box className={classes.box}>
        <Grid container spacing={1} className={classes.gridContainer}>
          {steps.map((step, i) => (
            <Grid key={i} item xs={12} sm={4} lg={4} className={classes.itemGrid}>
              <OneItem title={step.title} description={step.description} stepId={i + 1} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Items;
