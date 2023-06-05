import {
  Box, Typography, makeStyles, useMediaQuery, Theme,
} from '@material-ui/core';
import DayJS from 'components/DayJS';
import dayjs from 'dayjs';
import usePageTranslation from 'hooks/usePageTranslation';
import React from 'react';
import SelectMoveInDate from './SelectMoveInDate';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '100px',
    display: 'block !important',
    alignContent: 'center',
  },
  heading: {
    fontSize: '30px',
    fontWeight: 700,
    margin: '0 30px',
    lineHeight: '35px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      lineHeight: '20px',
      margin: '0 20px',
    },
  },
  subHeading: {
    fontSize: '16px',
    margin: '0 30px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '20px',
      margin: '0 20px',
    },
  },
  content: {
    display: 'flex',
    alignContent: 'center',
  },
}));

interface IProps {
  setMoveInDate: (moveIn: dayjs.Dayjs) => void;
  moveInDate: dayjs.Dayjs
}

const FormMoveInDate: React.FC<IProps> = ({ moveInDate, setMoveInDate }) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
  const { t } = usePageTranslation('darkStorage', 'ChooseMoveInDate');

  return (
    <Box className={classes.root}>
      <Typography className={classes.heading}>{t('title')}</Typography>
      <Typography className={classes.subHeading}>{t('content')}</Typography>
      <Box className={classes.content} display="flex" justifyContent="center" flexDirection={isMobile ? 'column' : 'row'}>
        <SelectMoveInDate
          onChange={(date) => {
            setMoveInDate(date);
          }}
          value={moveInDate}
          minValue={DayJS().add(3, 'day')}
          maxValue={DayJS().add(29, 'day')}
        />
      </Box>
    </Box>
  );
};

export default FormMoveInDate;
