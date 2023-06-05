import React from 'react';
import {
  Box,
  makeStyles,
  Grid,
} from '@material-ui/core';
import dayjs from 'dayjs';
import ChooseBox from './components/ChooseBox';
import ChooseAddress from './components/ChooseAddress';
import FormMoveInDate from './components/FormMoveInDate';

interface DarkStorageProps {
  step: number;
  setSpaceId: (id: number) => void;
  setMoveInDate: (moveIn: dayjs.Dayjs) => void;
  moveInDate: dayjs.Dayjs;
  address: string;
  setAddress: (val: string) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#FFFFFF',
    paddingTop: '17px',
    [theme.breakpoints.up('md')]: {
      paddingTop: '24px',
    },
    overflow: 'hidden',
    border: 'none',
  },
}));

const DarkStorage: React.FC<DarkStorageProps> = ({
  step,
  setSpaceId,
  setMoveInDate,
  moveInDate,
  address,
  setAddress,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        {step === 1 && <ChooseBox setSpaceId={setSpaceId} />}
        {step === 2 && <ChooseAddress address={address} setAddress={setAddress} />}
        {step === 3 && <FormMoveInDate setMoveInDate={setMoveInDate} moveInDate={moveInDate} />}
      </Grid>
    </Box>
  );
};

export default DarkStorage;
