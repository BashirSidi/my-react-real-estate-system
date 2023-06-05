import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControlLabel,
  Hidden,
  makeStyles,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import * as gtag from 'utilities/gtag';
import { GetPublicPromotionsQuery_promotions_edges } from 'modules/checkout/queries/__generated__/GetPublicPromotionsQuery';
import { getTranslatedName, useCurrentCountry } from 'utilities/market';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { filterPromotions } from 'utilities/promotions';
import { capitalizeFirstLetter } from 'utilities/capitalizeFirstLetter';
import { Check } from '@material-ui/icons';
import IEventName from 'shared/event-name.enum';
import * as intercom from 'utilities/intercom';
import clsx from 'clsx';
import Image from '../../../../components/Image';
import Grey3Typography from '../../../../components/Typographies/Grey3Typography';
import { BookingStore, BOOKING_STORE } from '../../stores/BookingStore';
import { PromotionStore, PROMOTION_STORE_KEY } from '../../stores/PromotionStore';
import StyledRadio from '../../../../components/RadioButton';
import PromoCodeInput from './PromoCode';
import { IPromotion } from '../../hooks/useCheckoutPrice';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import TooltipInfo from '../../../detail/components/StickyBookWidget/TooltipInfo';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';

interface IProps {
  [BOOKING_STORE]?: BookingStore;
  [PROMOTION_STORE_KEY]?: PromotionStore;
  [AUTH_STORE_KEY]?: AuthStore;
  appliedPromotion: IPromotion;
  promotionError: string;
  appliedPublicPromotion: IPromotion;
  total: number;
}

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up('sm')]: {
      border: '1px solid #06C270',
      borderRadius: '30px',
      paddingBottom: '20px',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    background: '#e6f9f1',
    borderRadius: '30px 30px 0 0',
    padding: '15px 20px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 26px',
      borderRadius: '0px',
      margin: '0px',
      height: '50px',
      width: '100%',
      zIndex: 9,
      border: 'none',
      position: 'absolute',
      left: 0,
      right: 0,
    },
  },
  root: {
    marginRight: '0',
  },
  label: {
    color: theme.palette.grey[200],
  },
  infoIcon: {
    marginLeft: '6px',
    marginTop: '7px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
  padding: {
    padding: '0 20px',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
  },
  radioGroups: {
    paddingLeft: '10px',
  },
  promoInfo: {
    marginTop: '15px',
  },
  promotionBanner: {
    position: 'relative',
    display: 'flex',
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
    fontSize: '14px',
    fontWeight: 400,
    padding: '6px 11px 6px 10px',
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
    marginBottom: '9px',
    [theme.breakpoints.down(962)]: {
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: '0px',
      width: '100vw',
      zIndex: 9,
      border: 'none',
      padding: '6px 11px 6px 10px',
      position: 'absolute',
      left: 0,
      right: 0,
    },
  },
  shoppingIcon: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: '15px',
      marginRight: '10px',
    },
  },
  promotionText: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    marginTop: '3px',
    marginLeft: '5px',
    [theme.breakpoints.up('sm')]: {
      fontSize: 12,
    },
  },
  triangle: {
    position: 'absolute',
    right: 0,
    top: '2px',
    borderRight: 'solid 12px rgb(255, 255, 255)',
    borderBottom: 'solid 17px transparent',
    borderTop: 'solid 14px transparent',
    [theme.breakpoints.down(962)]: {
      borderRight: 'none',
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
    },
  },
  selectedPromoInfo: {
    position: 'relative',
    fontFamily: 'poppins',
    fontStyle: 'normal',
    marginLeft: '45px',
    fontSize: '12px',
    fontWeight: 400,
    color: theme.palette.grey[100],
  },
  check: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    color: theme.palette.success.main,
    fontWeight: 400,
  },
  checkText: {
    marginLeft: '5px',
    marginTop: '0,2rem',
  },
  checkTextActive: {
    fontWeight: 600,
  },
  animatedItem: {
    '&[shake]': {
      animation: '$shake 1500ms',
      animationIterationCount: '1',
      animationTimingFunction: 'ease-in-out',
    },
  },
  '@keyframes shake': {
    '0%': {
      opacity: 1,
      border: '1px solid orange',
    },
    '30%': { opacity: 0.5, border: '2px solid orange' },
    '50%': { opacity: 1, border: '1px solid orange' },
    '70%': { opacity: 0.5, border: '0.5px solid orange' },
    '100%': { opacity: 1, border: '0.2px solid orange' },
  },
}));

const Promotions: React.FC<IProps> = ({
  promotionStore,
  bookingStore,
  appliedPromotion,
  promotionError,
  appliedPublicPromotion,
  bookingStore: { bookingDetails, booking },
  auth: { user },
  total,
}) => {
  const router = useRouter();
  const defaultPromoId = router.query?.promotion_id ? Number(router.query?.promotion_id) : null;
  const country = useCurrentCountry();
  const [publicPromos, setPublicPromos] = useState<GetPublicPromotionsQuery_promotions_edges[]>([]);
  const triggerPromotionAppliedEvent = () => {
    try {
      const trackingPayload = {
        status: publicPromos?.[0]?.status || '',
        spaceName: bookingStore?.space?.name || '',
        platform: 'WEB',
        baseAmount: booking?.base_amount || 0,
        promoEndDate: publicPromos?.[0]?.end_date || '',
        depositAmount: bookingStore?.total?.value || 0,
        subTotalAmount: bookingStore?.subTotal?.value || 0,
        discountAmount: booking?.discount_amount || 0,
        insuranceAmount: booking?.insurance?.price_per_day || 0,
        promotionStartDay: publicPromos?.[0]?.start_date || '',
        totalAmount: total || 0,
        country: country?.name,
        userId: user?.id || '',
        currency: country?.currency,
        spaceId: bookingStore?.spaceId || '',
        customerEmail: user?.email || '',
        siteId: bookingStore?.space?.site?.id || '',
        spaceSize: bookingStore?.space?.size || 0,
        customerPhone: user?.phone_number,
        siteName: bookingStore?.space?.site?.name || '',
        promotionName: appliedPromotion?.name_en || '',
        customerName: `${user?.first_name || ''} ${user?.last_name || ''}`,
      };
      const eventName = IEventName.PROMOTION_APPLIED;
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.PROMOTION_APPLIED, errEvent);
    }
  };

  const gtagTracking = (value) => {
    const selectedPromo = promotionStore?.publicPromotions?.find((promo) => promo.id === value);
    if (selectedPromo) {
      gtag.enhancedTrack({
        event: 'promotionClick',
        ecommerce: {
          promoClick: {
            promotions: [{
              promoId: selectedPromo.id,
              promoName: selectedPromo.name_en,
            }],
          },
        },
      });
      triggerPromotionAppliedEvent();
    }
  };

  const changePromo = (value) => {
    if (value !== bookingStore.bookingDetails.promoId) {
      gtagTracking(value);
      bookingStore.setBookingDetails('promoId', value);
    }
  };

  useEffect(() => {
    const siteId = bookingStore?.space?.site?.id;
    if (siteId) {
      setPublicPromos(filterPromotions(promotionStore?.publicPromotions, siteId));
    }
  }, [bookingStore?.space?.site?.id, promotionStore?.publicPromotions]);

  const { t } = usePageTranslation('checkout', 'Promotions');
  const classes = useStyles();
  useEffect(() => {
    if (publicPromos?.length) {
      const trackingPayload = [];
      for (let i = 0; i < publicPromos.length; i += 1) {
        trackingPayload.push({
          id: publicPromos[i].id,
          name: publicPromos[i].name_en,
        });
      }
      gtag.enhancedTrack({
        ecommerce: {
          promoView: {
            promotions: trackingPayload,
          },
        },
      });
    }
  }, [publicPromos]);

  useEffect(() => {
    if (defaultPromoId) {
      changePromo(defaultPromoId);
    }
  }, []);
  return (
    <Box>
      <Box minHeight="50px" className={classes.promoInfo}>
        {!!bookingStore.bookingDetails.promoId?.value && (!appliedPublicPromotion?.id && !!total
          && <Typography className={classes.error}>{t('error')}</Typography>)}
        <Hidden smDown>
          { // eslint-disable-next-line
            isNaN(bookingDetails?.promoId?.value) === true &&
            publicPromos?.length > 0
            && (
            <Box component="div" className={classes.promotionBanner}>
              <Image name="alert" folder="CheckoutPage" className={classes.shoppingIcon} />
              <Typography className={classes.promotionText}>
                {t('bannerText')}
              </Typography>
              <Box className={classes.triangle} />
            </Box>
            )
          }
        </Hidden>
        <Hidden smUp>
          <Box className={classes.header}>
            <Box>
              <Grey3Typography variant="h5">
                {t('grey3Typography')}
              </Grey3Typography>
            </Box>
          </Box>
        </Hidden>
      </Box>
      <Hidden smUp>
        {// eslint-disable-next-line
                isNaN(bookingDetails?.promoId?.value) === true &&
                publicPromos?.length > 0
              && (
                <Box component="div" className={classes.promotionBanner}>
                  <Image name="alert" folder="CheckoutPage" className={classes.shoppingIcon} />
                  <Typography className={classes.promotionText}>
                    {t('bannerText')}
                  </Typography>
                  <Box className={classes.triangle} />
                </Box>
              )
            }
      </Hidden>
      <Box id="promotionsID_" mb={8} className={clsx(classes.container, classes.animatedItem)}>
        {publicPromos?.length > 0 && (
          <>
            <Hidden smDown>
              <Box className={classes.header}>
                <Box>
                  <Grey3Typography variant="h5">
                    {t('grey3Typography')}
                  </Grey3Typography>
                </Box>
              </Box>
            </Hidden>

            <Box id="promotionsID_" className={classes.padding}>
              <Box>
                <RadioGroup className={classes.radioGroups} aria-label="promoId" name="customized-radios">
                  {publicPromos.map((promo, index) => (
                    <Box key={index}>
                      <Box id={`promo${index}`} display="flex" alignItems="center">
                        <FormControlLabel
                          control={(
                            <StyledRadio
                              id="promotionRadio"
                              value={promo.id}
                              checked={
                                bookingDetails?.promoId
                                  ? bookingDetails?.promoId.value === promo.id
                                  : defaultPromoId === promo.id
                              }
                              onChange={() => changePromo(promo.id)}
                            />
                          )}
                          label={capitalizeFirstLetter(getTranslatedName(promo, 'name', router.locale))}
                          classes={{ root: classes.root, label: classes.label }}
                        />
                        <TooltipInfo
                          className={classes.infoIcon}
                          key={promo.id}
                          item={promo}
                        />
                      </Box>
                      {!!bookingDetails?.promoId?.value && (
                        <Box>
                          <Typography className={classes.selectedPromoInfo}>
                            {
                              promo?.id === appliedPublicPromotion?.id
                                ? (
                                  <div>
                                    <div className={classes.check}>
                                      <Check />
                                      <div className={classes.checkText}>
                                        {t('activeText1')}
                                        {' '}
                                        <span className={classes.checkTextActive}>{t('activeText2')}</span>
                                      </div>
                                    </div>
                                    {capitalizeFirstLetter(getTranslatedName(promo, 'description', router.locale))}
                                  </div>
                                )
                                : ''
                            }
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                  <FormControlLabel
                    control={(
                      <StyledRadio
                        value={null}
                        checked={bookingDetails?.promoId?.value === null}
                        onChange={() => changePromo(null)}
                      />
                    )}
                    label={t('label')}
                    classes={{ root: classes.root, label: classes.label }}
                  />
                </RadioGroup>
              </Box>
            </Box>
          </>
        )}

        <Box className={classes.padding}>
          <PromoCodeInput promotionError={promotionError} appliedPromotion={appliedPromotion} />
        </Box>
      </Box>
    </Box>
  );
};

export default inject(BOOKING_STORE, PROMOTION_STORE_KEY, AUTH_STORE_KEY)(observer(Promotions));
