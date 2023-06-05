import { Box } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PrimaryButton from '../../../../../components/Buttons/PrimaryButton';
import WhiteTypography from '../../../../../components/Typographies/WhiteTypography';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const useStyles = makeStyles((theme) => ({
  buttonBox: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  addPromotion: {
    fontWeight: 700,
    fontSize: '1.3rem',
    width: '298px',
    [theme.breakpoints.down('xs')]: {
      width: '200px',
    },
  },
}));

interface IProps {
  addPromotion: () => void;
}

const Buttons: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const {
    addPromotion,
  } = props;
  const { t } = usePageTranslation('checkout', 'PromotionDialog');
  return (
    <Box>
      <Box className={classes.buttonBox}>
        <PrimaryButton fullWidth onClick={addPromotion}>
          <WhiteTypography className={classes.addPromotion}>
            {t('typography4')}
          </WhiteTypography>
        </PrimaryButton>
      </Box>
    </Box>
  );
};
export default Buttons;
