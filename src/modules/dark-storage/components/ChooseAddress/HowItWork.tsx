import React from 'react';
import { makeStyles, Typography, Grid } from '@material-ui/core';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import Image from '../../../../components/Image';

const useStyles = makeStyles(() => ({
  icon: {
    padding: '10px',
  },
  stepTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  stepContent: {
    fontSize: '12px',
    fontWeight: 400,
  },
  boxContainer: {
    margin: '10px 0',
  },
}));

const HowItWork: React.FC = () => {
  // Constants
  const classes = useStyles();
  const { t } = usePageTranslation('darkStorage', 'ChooseAddress');

  return (
    <Grid container spacing={8} className={classes.boxContainer}>
      <Grid md={3} item>
        <Image
          className={classes.icon}
          name="schedule-icon"
          folder="DarkStorage"
        />
        <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
        <div style={{ width: '80%' }}>
          <Typography className={classes.stepTitle}>
            {t('howToStep1Title')}
          </Typography>
          <Typography className={classes.stepContent}>
            {t('howToStep1Content')}
          </Typography>
        </div>
      </Grid>
      <Grid md={3} item>
        <Image
          className={classes.icon}
          name="receive-icon"
          folder="DarkStorage"
        />
        <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
        <div style={{ width: '80%' }}>
          <Typography className={classes.stepTitle}>
            {t('howToStep2Title')}
          </Typography>
          <Typography className={classes.stepContent}>
            {t('howToStep2Content')}
          </Typography>
        </div>
      </Grid>
      <Grid md={3} item>
        <Image
          className={classes.icon}
          name="truck-icon"
          folder="DarkStorage"
        />
        <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
        <div style={{ width: '80%' }}>
          <Typography className={classes.stepTitle}>
            {t('howToStep3Title')}
          </Typography>
          <Typography className={classes.stepContent}>
            {t('howToStep3Content')}
          </Typography>
        </div>
      </Grid>
      <Grid md={3} item>
        <Image
          className={classes.icon}
          name="warehouse-icon"
          folder="DarkStorage"
        />
        <Image folder="Homepage" name="arrow-dashNext" extension="svg" />
        <Typography className={classes.stepTitle}>
          {t('howToStep4Title')}
        </Typography>
        <Typography className={classes.stepContent}>
          {t('howToStep4Content')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HowItWork;
