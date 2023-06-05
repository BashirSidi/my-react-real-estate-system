import { Box, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import CheckoutLayout from '../../../../../layouts/CheckoutLayout';
import InputCurrentLocation from '../../InputCurrentLocation';
import ButtonConfirm from '../../ButtonConfirm';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import { Map } from '../../Map';
import { BOX_TO_BOX_ADDRESS_KEY } from '../../../../checkout/stores/BookingStore';
import { getLocalStorage } from '../../../../../utilities/localStorage';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#FFFFFF',
    margin: '0 -26px',
    height: 'calc(100vh - 73px)',
    overflow: 'hidden',
    position: 'relative',
  },
  inputContainer: {
    position: 'absolute',
    top: '8px',
    zIndex: 2,
    width: '100%',
    padding: '0 25px',
  },
  inputBox: {
    margin: '0 25px',
  },
  buttonBox: {
    position: 'absolute',
    bottom: '49px',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 25px',
  },
}));

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setAddress: (address: string) => void;
}

const MobileVersion: React.FC<IProps> = (props) => {
  const { isOpen, setIsOpen, setAddress } = props;
  const classes = useStyles();
  const { t } = usePageTranslation('checkout', 'MobileVersion');
  const coords = JSON.parse(getLocalStorage(BOX_TO_BOX_ADDRESS_KEY));

  return (
    <Dialog open={isOpen} fullScreen>
      <CheckoutLayout
        text={t('text')}
        cb={() => {
          setIsOpen(false);
        }}
      >
        <Box className={classes.root}>
          <Box className={classes.inputContainer}>
            <InputCurrentLocation setAddress={setAddress} />
          </Box>
          <Map
            coords={{
              lat: coords?.lat,
              lng: coords?.lng,
            }}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '90vh', zIndex: 10000 }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
          <Box className={classes.buttonBox}>
            <ButtonConfirm onClick={() => setIsOpen(false)} />
          </Box>
        </Box>
      </CheckoutLayout>
    </Dialog>
  );
};

export default MobileVersion;
