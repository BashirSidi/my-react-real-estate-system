import React, { FC, useEffect } from 'react';
import { makeStyles, Box } from '@material-ui/core';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import { getCurrentAnonymousUserId } from 'utilities/user';
import { useCurrentCountry } from 'utilities/market';
import useTranslation from 'next-translate/useTranslation';
import * as clevertap from 'utilities/clevertap';
import ListYourSpace from './ListYourSpace';
import HelpButton from './HelpButton';
import HowToHost from './HowToHost';
import SafetyFirst from './SafetyFirst';
import EasyPayments from './EasyPayments';
import Footer from '../../../components/Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
}));

interface IProps {
  [AUTH_STORE_KEY]?: AuthStore;
}

const HostLanding: FC<IProps> = ({ auth }) => {
  const classes = useStyles();
  const { lang } = useTranslation();
  const countryName = useCurrentCountry().name;

  useEffect(() => {
    const userId = auth?.user?.id ?? getCurrentAnonymousUserId();
    const payload = {
      auth,
      userId,
      countryName,
      language: lang,
    };
    clevertap.identifyUser(payload);

    // eslint-disable-next-line
  }, []);

  return (
    <Box className={classes.root}>
      <ListYourSpace />
      <HowToHost />
      <SafetyFirst />
      <EasyPayments />
      <Footer />

      {/* <HelpButton /> */}
    </Box>
  );
};

export default HostLanding;
