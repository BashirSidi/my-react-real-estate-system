import {
  Box, List, ListItem, ListItemText, makeStyles, Typography,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import ClevertapReact from 'clevertap-react';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

import { useCurrentCountry } from 'utilities/market';
import { ITrackingHost } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import Grey3Typography from '../../../../../../components/Typographies/Grey3Typography';
import PrimaryButton from '../../../../../../components/Buttons/PrimaryButton';
import Image from '../../../../../../components/Image';
import HostOnboardingStore, { ONBOARDING_STORE } from '../../../../stores/HostOnboardingStore';
import usePageTranslation from '../../../../../../hooks/usePageTranslation';
import AuthStore, { AUTH_STORE_KEY } from '../../../../../app/stores/AuthStore';

const useStyles = makeStyles((theme) => ({
  mainBox: {
    maxWidth: '630px',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: '50px 20px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px',
    },
  },
  formBox: {
    marginTop: '27px',
  },
  paddingRight: {
    paddingRight: '80px',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '0',
    },
  },
  boldBox: {
    marginTop: '40px',
    marginLeft: '-20px',
  },
  heading: {
    textDecoration: 'underline',
  },
  listItem: {
    marginBottom: '20px',
  },
  listItemText: {
    marginLeft: '20px',
  },
  finishButton: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '1.6rem',
    width: '150px',
    padding: '11px 0',
  },
}));

interface IProps {
  store?: HostOnboardingStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const FinishListing: FC<IProps> = ({ store: { goToStep, setStepSavingFunction }, auth }) => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = usePageTranslation('hostOnBoarding', 'FinishListing');
  const links = [
    { title: t('linkTitle1'), step: 2 },
    { title: t('linkTitle2'), step: 3 },
    { title: t('linkTitle3'), step: 6 },
    { title: t('linkTitle4'), step: 7 },
    { title: t('linkTitle5'), step: 9 },
  ];
  const country = useCurrentCountry()?.name;

  const finishWizard = () => {
    const eventName = IEventName.HOST_ONBOARDING_FINISHED;
    const trackingPayload: ITrackingHost = {
      country,
      platform: 'WEB',
      language: router.locale,
      customerPhone: auth?.user?.phone_number,
      customerEmail: auth?.user?.email,
      customerName: `${auth?.user?.first_name}${auth?.user?.last_name}`,
      userId: auth?.user?.id || 0,
    };
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
    router.push('/host/listings');
  };

  useEffect(() => {
    setStepSavingFunction(finishWizard);
  }, []);

  return (
    <Box className={classes.mainBox}>
      <Box>
        <Box>
          <Typography variant="h1">
            {t('typography')}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.formBox}>
        <Box className={classes.paddingRight}>
          <Box>
            <Grey3Typography variant="body1">
              {t('grey3Typography')}
            </Grey3Typography>
          </Box>
          <Box className={classes.boldBox}>
            <List>
              {links.map((link, i) => (
                <ListItem key={i} button className={classes.listItem}>
                  <Image name="check_dark" extension="svg" />
                  <ListItemText
                    className={classes.listItemText}
                    onClick={() => goToStep(link.step, true)}
                  >
                    <Grey3Typography variant="h3" className={classes.heading}>
                      {link.title}
                    </Grey3Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
      <Box mt={30}>
        <PrimaryButton className={classes.finishButton} onClick={finishWizard}>
          {t('primaryButton')}
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default inject(ONBOARDING_STORE, AUTH_STORE_KEY)(observer(FinishListing));
