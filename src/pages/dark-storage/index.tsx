import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import ProgressLine from 'modules/host-onboarding/components/Header/ProgressLine';
import dayjs from 'dayjs';
import { HomeLayout } from '../../layouts/MainLayout';
import DarkStorageComp from '../../modules/dark-storage';
import usePageTranslation from '../../hooks/usePageTranslation';
import {
  BOX_TO_BOX_ADDRESS_KEY,
} from '../../modules/checkout/stores/BookingStore';
import { getLocalStorage, setLocalStorage } from '../../utilities/localStorage';

const useStyles = makeStyles(() => ({
  progress: {
    '& div': {
      margin: '0 auto',
      maxWidth: '1065px',
    },
  },
}));

type IQuery = {
  move_in?:string,
  space_id?: number
};

const DarkStorage: React.FC = () => {
  const { t } = usePageTranslation('darkStorage', 'Details');
  const classes = useStyles();
  const router = useRouter();
  const pickUpData = getLocalStorage(BOX_TO_BOX_ADDRESS_KEY);

  const [step, setStep] = useState(1);
  const [spaceId, setSpaceId] = useState(null);
  const [moveInDate, setMoveInDate] = useState(dayjs().add(1, 'day'));
  const [address, setAddress] = useState(pickUpData ? JSON.parse(pickUpData)?.address : '');

  const goToCheckout = async () => {
    const query: IQuery = {
      move_in: moveInDate.format('DD-MM-YYYY'),
    };

    if (spaceId) {
      query.space_id = spaceId;
    }

    setLocalStorage(BOX_TO_BOX_ADDRESS_KEY, JSON.stringify({
      ...(pickUpData && JSON.parse(pickUpData)),
    }));

    router.push({
      pathname: '/checkout',
      query,
    });
  };

  return (
    <HomeLayout
      isShowBackground
      footer
      nextBtn={t('nextBtn')}
      prevBtn={t('prevBtn')}
      onNextClick={() => {
        if (step <= 2) setStep(step + 1);
        if (step === 3) goToCheckout();
      }}
      onPrevClick={() => {
        if (step >= 2) setStep(step - 1);
      }}
      prevDisabled={step <= 1}
      nextDisabled={(step === 1 && !spaceId) || (step === 2 && !address)}
    >
      <Box className={classes.progress}>
        <ProgressLine step={step} totalSteps={3} />
      </Box>
      <Box>
        <DarkStorageComp
          step={step}
          setSpaceId={setSpaceId}
          moveInDate={moveInDate}
          setMoveInDate={setMoveInDate}
          address={address}
          setAddress={setAddress}
        />
      </Box>
    </HomeLayout>
  );
};

export default DarkStorage;
