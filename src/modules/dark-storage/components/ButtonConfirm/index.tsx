import { Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import WhiteTypography from '../../../../components/Typographies/WhiteTypography';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { BOX_TO_BOX_ADDRESS_KEY } from '../../../checkout/stores/BookingStore';
import { getLocalStorage } from '../../../../utilities/localStorage';

const useStyles = makeStyles(() => ({
  button: {
    width: '100%',
  },
  buttonText: {
    fontSize: '1.3rem',
    fontWeight: 700,
  },
}));

interface IProps {
  onClick: () => void;
}

const ButtonConfirm: React.FC<IProps> = ({ onClick }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = usePageTranslation('checkout', 'ButtonConfirm');
  const coords = JSON.parse(getLocalStorage(BOX_TO_BOX_ADDRESS_KEY));

  return (
    <>
      <Snackbar
        open={isOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setIsOpen(false)}
      >
        <Alert severity="warning">
          {t('alert')}
        </Alert>
      </Snackbar>
      <PrimaryButton
        className={classes.button}
        onClick={() => {
          if (!coords?.lat) {
            setIsOpen(true);
            return;
          }

          onClick();
        }}
      >
        <WhiteTypography className={classes.buttonText}>
          {t('whiteTypography')}
        </WhiteTypography>
      </PrimaryButton>
    </>
  );
};

export default ButtonConfirm;
