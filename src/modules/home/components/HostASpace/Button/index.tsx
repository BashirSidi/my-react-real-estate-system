import { Box, Button, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { FC } from 'react';
import ClevertapReact from 'clevertap-react';
import { scrollTop } from 'utilities/scrollTop';
import { useCurrentCountry } from 'utilities/market';
import { ITrackingHome } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import AuthStore, { AUTH_STORE_KEY } from '../../../../app/stores/AuthStore';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

interface IProps {
  [AUTH_STORE_KEY]?: AuthStore;
}

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '388px',
      minWidth: '300px',
      margin: '20px auto 0',
    },
  },
  button: {
    backgroundColor: '#F9E2C7',
    borderRadius: '15px',
    color: theme.palette.secondary.main,
    padding: '10px',
    fontWeight: 700,
    width: '100%',
    height: '50px',
    fontSize: '13px',
    lineHeight: '19.5px',
    [theme.breakpoints.up('md')]: {
      fontSize: '24px',
      maxWidth: '390px',
      marginTop: '40px',
      fontWeight: 600,
      height: '60px',
    },
    '&:hover': {
      backgroundColor: '#F9E2C7',
    },
  },
}));

const ButtonHost:FC<IProps> = ({ auth }) => {
  const router = useRouter();
  const { name, currency } = useCurrentCountry();
  const goToHostPage = () => {
    const trackingPayload: ITrackingHome = {
      customerEmail: auth?.user?.email,
      customerPhone: auth?.user?.phone_number,
      customerName: `${auth?.user?.first_name}${auth?.user?.last_name}`,
      userId: auth?.user?.id,
      currency,
      status: '',
      siteName: '',
      country: name,
    };
    const eventName = IEventName.HOST_SPACE_CLICKED;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
    router.push('/host').then(() => scrollTop());
  };
  const classes = useStyles();
  const { t } = usePageTranslation('home', 'HostASpace');
  return (
    <Box mt={10} className={classes.container}>
      <Button id="hostASpaceButton" className={classes.button} onClick={goToHostPage} fullWidth>{t('button')}</Button>
    </Box>
  );
};

export default inject(AUTH_STORE_KEY)(observer(ButtonHost));
