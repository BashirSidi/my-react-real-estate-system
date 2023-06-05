import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Link } from '@material-ui/core';
import { useQuery } from '@apollo/client';

import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import { inject, observer } from 'mobx-react';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { useCurrentCountry } from 'utilities/market';
import { ISpaceType, ITrackingEstimator } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { GET_SPACE_PRICE_BY_TYPE } from '../../queries';
import { GetSpacePriceByType, GetSpacePriceByTypeVariables } from '../../queries/__generated__/GetSpacePriceByType';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';

interface IProps {
  categoryId: number,
  spaceTypeId: number,
  [AUTH_STORE_KEY]?: AuthStore;
  spaceType: ISpaceType;
  itemsDimension: number;
}

const useStyle = makeStyles((theme) => ({
  container: {
    borderRadius: '22px 22px 0 0',
    boxShadow: '0px 15px 40px rgba(51, 51, 51, 0.1)',
    padding: '15px 25px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      marginTop: '-60px',
      boxShadow: 'none',
      width: '50%',
      padding: 0,
      marginBottom: '250px',
    },
  },
  text: {
    fontSize: '14px',
    '& .MuiTypography-overline': {
      fontSize: '14px',
      marginRight: '3px',
      textTransform: 'none',
    },
  },
  bold: {
    fontWeight: 600,
  },
  button: {
    '& button': {
      fontWeight: 600,
      fontSize: '13px',
      color: '#FFFFFF',
      padding: '14px 30px',
      [theme.breakpoints.up('sm')]: {
        padding: '14px 100px',
      },
    },
  },
  link: {
    textDecoration: 'none !important',
  },
}));

const FindStorage: FC<IProps> = ({
  spaceTypeId, categoryId, auth, spaceType, itemsDimension,
}) => {
  const classes = useStyle();
  const { t } = usePageTranslation('estimator', 'FindStorage');
  const router = useRouter();
  const country = useCurrentCountry();

  const { data } = useQuery<GetSpacePriceByType, GetSpacePriceByTypeVariables>(
    GET_SPACE_PRICE_BY_TYPE,
    { variables: { spaceTypeId, country: country.name } },
  );

  const space = data?.spaces?.edges.length ? data?.spaces?.edges[0] : null;
  const price = space?.prices.length ? space?.prices[0] : null;

  const triggerFindStorageEvent = () => {
    try {
      const trackingPayload: ITrackingEstimator = {
        customerEmail: auth?.user?.email,
        customerPhone: auth?.user?.phone_number,
        customerName: auth?.user?.first_name,
        language: router?.locale,
        country: country.name,
        platform: 'WEB',
        districtName: '',
        city: '',
        boxType: categoryId,
        boxSize: itemsDimension,
        totalBoxes: null,
        recommendedPlan: spaceTypeId,
      };
      const eventName = IEventName.FIND_STORAGE_CLICKED;
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.FIND_STORAGE_CLICKED, errEvent);
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.text}>
        <Typography>
          {t('typography1')}
        </Typography>
        <Typography variant="overline" className={classes.bold}>
          {price?.currency_sign || ''}
          {new Intl.NumberFormat(router.defaultLocale)
            .format(price?.price_per_month)}
          /
        </Typography>
        <Typography variant="overline">
          {t('typography2')}
        </Typography>
      </Box>
      <Box className={classes.button} onClick={() => triggerFindStorageEvent()}>
        <Link
          color="inherit"
          className={classes.link}
          href={`/${router.locale}/search?space_type=${spaceTypeId}`}
        >
          <PrimaryButton>
            {t('typography3')}
          </PrimaryButton>
        </Link>
      </Box>
    </Box>
  );
};

export default inject(AUTH_STORE_KEY, AUTH_STORE_KEY)(observer(FindStorage));
