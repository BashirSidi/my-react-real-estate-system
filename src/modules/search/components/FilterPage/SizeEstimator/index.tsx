import {
  Box,
  fade,
  makeStyles,
  Typography,
  Link,
} from '@material-ui/core';

import { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import ClevertapReact from 'clevertap-react';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import { getTranslatedName, useCurrentCountry } from 'utilities/market';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import Image from '../../../../../components/Image';
import Options from './Options';
import SiteDetailStore, { SITE_DETAIL_STORE } from '../../../../detail/stores/SiteDetailStore';
import AuthStore, { AUTH_STORE_KEY } from '../../../../app/stores/AuthStore';
import { SpaceStatus } from '../../../../../typings/graphql.types';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '15px 25px 0',
    paddingBottom: '30px',
    [theme.breakpoints.only('xs')]: {
      borderBottom: `1px solid ${fade(theme.palette.grey[100], 0.1)}`,
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: '900px',
    },
  },
  beforeTitle: {
    display: 'flex',
    margin: '10px 0',
  },
  ask: {
    marginLeft: '8px',
    color: theme.palette.grey[100],
  },
  title: {
    margin: '14px 2px 15px',
  },
  options: {},
  estimate: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none !important',
  },
}));

interface IProps {
  [SITE_DETAIL_STORE]?: SiteDetailStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const SizeEstimator: React.FC<IProps> = ({ store, auth }) => {
  const classes = useStyles();
  const country = useCurrentCountry();
  const { t } = usePageTranslation('search', 'SizeEstimator');
  const router = useRouter();
  const { site, space } = store;

  const triggerEstimatorEvent = () => {
    const eventName = IEventName.SIZE_ESTIMATOR_CLICKED;
    try {
      const trackingPayload = {
        districtName: site?.address?.district?.name_en || '',
        baseAmount: space?.prices[0]?.price_per_month || 0,
        customerEmail: auth?.user?.email || '',
        customerPhone: auth?.user?.phone_number || '',
        customerName: `${auth?.user?.first_name ?? 'anonymous'}${auth?.user?.last_name ?? ''}`,
        moveIn: '',
        siteId: site?.id || 0,
        platform: 'WEB',
        country: country?.name,
        userId: auth?.user?.id || 0,
        currency: country?.currency,
        status: space?.status || SpaceStatus.ACTIVE,
        siteName: getTranslatedName(site, 'name', router.locale) || '',
        spaceSize: space?.size || 0,
        value: 0,
      };
      intercom.track(eventName, trackingPayload);
      gtag.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(eventName, errEvent);
    }
    router.push(`/${router.locale}/estimator`);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        <Typography variant="h4">
          {t('typography2')}
        </Typography>
      </Box>
      <Box className={classes.beforeTitle}>
        <Box>
          <Image name="help" folder="SearchLocation" />
        </Box>
        <Box className={classes.ask} onClick={triggerEstimatorEvent}>
          <Link className={classes.link} color="inherit">
            <Typography
              className={classes.estimate}
              variant="body2"
            >
              {t('typography1')}
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box className={classes.options}>
        <Options />
      </Box>
    </Box>
  );
};

export default inject(SITE_DETAIL_STORE, AUTH_STORE_KEY)(observer(SizeEstimator));
