import {
  Box, makeStyles, Typography, useMediaQuery, Theme, Divider,
} from '@material-ui/core';
import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import { inject, observer } from 'mobx-react';
import { BOX_TO_BOX } from 'config';
import { SiteStatus } from 'typings/graphql.types';
import { getTranslatedName, useCurrentCountry } from 'utilities/market';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import IEventName from 'shared/event-name.enum';
import PrimaryButton from '../../../../../components/Buttons/PrimaryButton';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import { Carousel } from '../../FeaturedListings/KeenCarousel';
import { getDarkStorageQuery, getDarkStorageQueryVariables } from './queries/__generated__/getDarkStorageQuery';
import { GET_DARK_STORAGE_QUERY } from './queries';
import SkeletonLoader from './SkeletonLoader';
import SiteDetailStore, { SITE_DETAIL_STORE } from '../../../../detail/stores/SiteDetailStore';
import AuthStore, { AUTH_STORE_KEY } from '../../../../app/stores/AuthStore';

const useStyles = makeStyles((theme) => ({
  title34: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333333',
    margin: '30px 0',
    [theme.breakpoints.up('md')]: {
      marginBottom: '35px',
    },
  },
  section3: {
    padding: '10px 0',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      padding: '0 0 30px',
    },
  },
  section4: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      marginTop: '30px',
    },
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
  },
  boxCards: {
    display: 'flex',
    justifyContent: 'center',
    gap: 50,
    overflowY: 'hidden',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      flexDirection: 'column',
    },
  },
  boxCard: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 30,
    backgroundColor: '#FFFFFF',
    border: '2px solid #E9E9E9',
    width: 250,
    borderRadius: 20,
  },
  boxCardBody: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  boxCardContent1: {
    color: '#EA5B21',
    fontSize: '1.9rem',
    fontWeight: 700,
  },
  boxCardContent2: {
    color: '#333333',
    fontSize: '1.7rem',
    fontWeight: 600,
  },
  boxCardContent3: {
    color: '#333333',
    fontSize: '1.4rem',
    fontWeight: 300,
  },
  boxCardContent4: {
    color: '#333333',
    fontSize: '1.4rem',
    fontWeight: 300,
    lineHeight: '25px',
    whiteSpace: 'nowrap',
  },
  boxImage: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('md')]: {},
  },
  button: {
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 700,
    width: 'max-content',
    padding: '15px 60px',
    textAlign: 'center',
  },
}));

interface IProps {
  [SITE_DETAIL_STORE]?: SiteDetailStore;
  [AUTH_STORE_KEY]?: AuthStore;
}
const Boxes: FC<IProps> = ({ store, auth }) => {
  const classes = useStyles();
  const { locale, push } = useRouter();
  const { site, space } = store;
  const country = useCurrentCountry();
  const { t } = usePageTranslation('home', 'DarkStorage');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const {
    loading,
    data: darkStorageData,
  } = useQuery<getDarkStorageQuery, getDarkStorageQueryVariables>(
    GET_DARK_STORAGE_QUERY,
    {
      variables: {
        where: {
          name: { _iLike: BOX_TO_BOX },
          status: { _eq: SiteStatus.INACTIVE },
        },
        pagination: { limit: 1, skip: 0 },
        spacesLimit: 2,
      },
    },
  );

  if (loading) return <SkeletonLoader />;
  const boxes = darkStorageData?.sites?.edges;

  const trackingPayload = {
    discountAmount: 0,
    totalAmount: 0,
    depositAmount: 0,
    subTotalAmount: 0,
    baseAmount: 0,
    customerEmail: auth?.user?.email || '',
    customerPhone: auth?.user?.phone_number || '',
    customerName: `${auth?.user?.first_name}${auth?.user?.last_name}` || '',
    insuranceAmount: 0,
    siteId: site?.id || 0,
    platform: 'WEB',
    country: country?.name,
    userId: auth?.user?.id || 0,
    currency: country?.currency || '',
    status: space?.status || '',
    siteName: site?.name_en || '',
    spaceSize: space?.size || 0,
  };

  const handleBookNow = () => {
    const eventName = IEventName.DARK_STORAGE_INITIATED;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
    push('/dark-storage');
  };

  return (
    <>
      {boxes && boxes[0]
      && (
      <>
        <Divider />
        <Box className={classes.section3}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.title34}>
              {t('section3_title')}
            </Typography>
          </Box>
          { isMobile
            ? (
              <Carousel>
                {boxes && boxes[0]?.spaces?.edges?.map((box, i) => (
                  <Box key={i} className={`keen-slider__slide ${classes.boxCard}`}>
                    <img className={classes.boxImage} src={box?.images[0]} alt={getTranslatedName(box, 'name', locale)} />
                    <Box className={classes.boxCardBody}>
                      <Box display="flex">
                        <Typography className={classes.boxCardContent1}>
                          {box?.prices[0]?.currency_sign}
                          {box?.prices[0]?.price_per_month}
                        </Typography>
                        <Typography>{t('box_perMonthOnBox')}</Typography>
                      </Box>
                      <Box className={classes.boxCardContent2}>
                        {box?.name === 'M1' && t('box_name1')}
                        {box?.name === 'L1' && t('box_name2')}
                      </Box>
                      <Box display="flex" alignItems="center" flexDirection="column">
                        <Typography className={classes.boxCardContent3}>
                          {t('dimensions')}
                          :
                        </Typography>
                        <Typography className={classes.boxCardContent4}>
                          W
                          {box?.width}
                          {' '}
                          x L
                          {box?.length}
                          {' '}
                          x H
                          {box?.height}
                          (cm)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            )
            : (
              <Box className={classes.boxCards}>
                {boxes && boxes[0]?.spaces?.edges?.map((box, i) => (
                  <Box key={i} className={`${classes.boxCard}`}>
                    <img className={classes.boxImage} src={box?.images[0]} alt={getTranslatedName(box, 'name', locale)} />
                    <Box className={classes.boxCardBody}>
                      <Box display="flex">
                        <Typography className={classes.boxCardContent1}>
                          {box?.prices[0]?.currency_sign}
                          {box?.prices[0]?.price_per_month}
                        </Typography>
                        <Typography>{t('box_perMonthOnBox')}</Typography>
                      </Box>
                      <Box className={classes.boxCardContent2}>
                        {box?.name === 'M1' && t('box_name1')}
                        {box?.name === 'L1' && t('box_name2')}
                      </Box>
                      <Box display="flex" alignItems="center" flexDirection="column">
                        <Typography className={classes.boxCardContent3}>
                          {t('dimensions')}
                          :
                        </Typography>
                        <Typography className={classes.boxCardContent4}>
                          W
                          {box?.width}
                          {' '}
                          x L
                          {box?.length}
                          {' '}
                          x H
                          {box?.height}
                          (
                          {box?.size_unit}
                          )
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
        <Box className={classes.section4}>
          <PrimaryButton className={classes.button} onClick={handleBookNow}>
            {t('button')}
          </PrimaryButton>
        </Box>
      </>
      )}
    </>
  );
};
export default inject(SITE_DETAIL_STORE, AUTH_STORE_KEY)(observer(Boxes));
