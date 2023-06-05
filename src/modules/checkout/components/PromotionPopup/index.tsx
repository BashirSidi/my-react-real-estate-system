import {
  Box,
  Dialog,
  Hidden,
  IconButton,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import HeaderText from './HeaderText';
import Buttons from './Buttons';
import BodyText from './BodyText';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: '15px',
    width: '544px',
    height: '353px',
  },
  headerBox: {
    padding: '20px 26px 7px 38px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `2px solid ${theme.palette.grey[50]}`,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
      borderBottom: '0',
      padding: '13px 4px 4px 0',
    },
  },
  headertext: {
    width: '100%',
    marginLeft: '10px',
  },
  bodyBox: {
    padding: '23px 43px 33px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 20px 29px',
    },
  },
  buttonsBox: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& button': {
      paddingLeft: '23px',
      paddingRight: '23px',
    },
    '& >div:last-child': {
      marginLeft: '13px',
    },
  },
  continueWithoutPromo: {
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    color: '#00A0E3',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '80px',
    marginTop: '10px',
    margin: '21%',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
}));

interface IProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setOpenPromoPopup: (x: boolean) => void;
  setPromotion: (x: boolean) => void;
  verificationSubmit: () => void;
}

const PromotionPopup: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const {
    isOpen,
    setIsOpen,
    setOpenPromoPopup,
    setPromotion,
    verificationSubmit,
  } = props;

  const { t } = usePageTranslation('checkout', 'PromotionDialog');

  React.useEffect(() => {
    if (isOpen) {
      const $selector = document.querySelector('#promotionsID_');
      $selector?.removeAttribute('shake');
    }
  }, [isOpen]);

  const handleCloseBtn = () => {
    setIsOpen(false);
    const $selector = document.querySelector('#promotionsID_');
    if ($selector) {
      $selector.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      $selector?.setAttribute('shake', '');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContinueButton = async () => {
    setOpenPromoPopup(false);
    setPromotion(true);
    verificationSubmit();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        className: classes.paper,
      }}
      disableScrollLock
      disableRestoreFocus
    >
      <Box className={classes.headerBox}>
        <Hidden xsDown>
          <Image folder="CheckoutPage" name="promo" />
          <Box className={classes.headertext}>
            <HeaderText />
          </Box>
        </Hidden>
        <Box>
          <IconButton onClick={handleClose}>
            <Image name="close" />
          </IconButton>
        </Box>
      </Box>
      <Box className={classes.bodyBox}>
        <BodyText />
        <Box className={classes.buttonsBox}>
          <Buttons addPromotion={handleCloseBtn} />
        </Box>
        <Box>
          <Box onClick={handleContinueButton}>
            <Box className={classes.continueWithoutPromo}>
              {t('typography5')}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};
export default PromotionPopup;
