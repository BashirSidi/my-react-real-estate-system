import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  Grid,
  Hidden,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import Sticky from 'react-stickynode';
import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import useTranslation from 'next-translate/useTranslation';
import { BOX_TO_BOX } from 'config';
import * as gtag from 'utilities/gtag';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import IEventName from 'shared/event-name.enum';
import { useCurrentCountry } from 'utilities/market';
import * as intercom from 'utilities/intercom';
import { useNewVersion } from 'hooks/useNewVersion';
import IFlagFeatures, { ISiteDetailsVersion } from 'shared/flag-features.enum';
import StorageInfo from './StorageInfo';
import ScheduleTime from './Forms/FormBookingDetails/ScheduleTime';
import PriceInfo from './PriceInfo';
import Promotions from './Promotions';
import Forms from './Forms';
import { BookingStore, BOOKING_STORE } from '../stores/BookingStore';
import Grey3Typography from '../../../components/Typographies/Grey3Typography';
import useCheckoutPrice from '../hooks/useCheckoutPrice';
import useSpaceAvailabilityToast from '../hooks/useSpaceAvailabilityToast';
import Timer from './Timer';
import SessionExpiredPopup from './SessionExpiredPopup';
import AffiliatePopup from './AffiliatePopup';
import usePageTranslation from '../../../hooks/usePageTranslation';
import PaymentSchedule from './PaymentSchedule';
import usePaymentSchedule from '../hooks/usePaymentSchedule';
import { checkTime } from '../../../utilities/checkTime';
import { StockManagementType } from '../../../typings/graphql.types';
import { PromotionStore, PROMOTION_STORE_KEY } from '../stores/PromotionStore';

const useStyles = makeStyles((theme) => ({
  rightSide: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '400px',
      padding: '30px 28px 15px',
      border: `1.5px solid ${theme.palette.grey[50]}`,
      borderRadius: '22px',
      marginTop: '50px',
    },
  },
  leftSide: {
    paddingBottom: '20px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '123px',
      marginRight: '35px',
    },
  },
}));

interface IProps {
  [BOOKING_STORE]?: BookingStore;
  [AUTH_STORE_KEY]?: AuthStore;
  [PROMOTION_STORE_KEY]?: PromotionStore;
}

const Checkout: React.FC<IProps> = ({
  bookingStore, bookingStore: {
    bookingDetails, pickUpDetails, isAvailable, checkAvailability, space, booking,
  }, auth: { user }, auth,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { lang } = useTranslation();
  const [manPower, setManPower] = useState(0);
  const country = useCurrentCountry();
  const pickupTime = `${bookingDetails.moveInDate.format(`YYYY-MM-DDT${checkTime(pickUpDetails?.time?.value)}:00:00.000`)}Z`;
  const [isOpen] = useState(true);
  let queryParam = '';
  if (typeof window !== 'undefined') {
    queryParam = window.localStorage.getItem('searchQueryParams');
  }
  const isBoxToBox = bookingStore?.booking?.site_name === BOX_TO_BOX;
  const defaultPromoId = router.query?.promotion_id ? Number(router.query?.promotion_id) : null;
  const {
    total,
    subTotal,
    services,
    insurance,
    deposit,
    discountedAmount,
    appliedPromotion,
    promotionError,
    currencySign,
    appliedPublicPromotion,
    appliedTax,
    totalTax,
  } = useCheckoutPrice({
    spaceId: bookingStore.spaceId,
    insuranceId: bookingStore.insuranceId,
    serviceId: bookingStore.serviceId,
    quotationItemId: bookingStore?.space?.quotation?.items[0]?.id,
    moveInDate: bookingDetails.moveInDate,
    moveOutDate: bookingDetails.autoRenewal ? undefined : bookingDetails.moveOutDate,
    promoCode: bookingDetails.promoCode.value,
    promoId: bookingDetails.promoId?.value || defaultPromoId,
    pickupDetails: pickUpDetails?.lat?.value && pickUpDetails?.lng?.value
      ? ({
        schedule_at: pickupTime,
        pick_up_location: {
          lat: pickUpDetails?.lat?.value,
          lng: pickUpDetails?.lng?.value,
        },
        additional_requirements: { mover_count: isBoxToBox ? 1 : manPower },
      })
      : undefined,
  });
  const featureName = IFlagFeatures.SITE_DETAILS_TEST;
  const featureValue = ISiteDetailsVersion.SITE_DETAILS_B;
  const isNewVersion = useNewVersion({ auth, featureName, featureValue });

  const paymentSchedule = usePaymentSchedule({
    spaceId: bookingStore.spaceId,
    insuranceId: bookingStore.insuranceId,
    serviceId: bookingStore.serviceId,
    quotationItemId: bookingStore?.space?.quotation?.items[0]?.id,
    moveInDate: bookingDetails.moveInDate,
    moveOutDate: bookingDetails.autoRenewal ? undefined : bookingDetails.moveOutDate,
    promoCode: bookingDetails.promoCode.value,
    promoId: bookingDetails.promoId?.value || defaultPromoId,
  });

  const notAvailableToast = useSpaceAvailabilityToast({
    moveInDate: bookingDetails.moveInDate,
    moveOutDate: bookingDetails.moveOutDate,
    isAvailable,
    siteId: space?.site?.id,
    checkAvailability,
  });

  const priceProps = {
    total,
    subTotal,
    services,
    insurance,
    deposit,
    discountedAmount,
    appliedPromotion,
    currencySign,
    appliedTax,
    totalTax,
  };
  const { t } = usePageTranslation('checkout', 'Checkout');
  const triggerPromotionAppliedEvent = () => {
    try {
      const trackingPayload = {
        discountAmount: discountedAmount || 0,
        subTotalAmount: subTotal || 0,
        depositAmount: deposit || 0,
        spaceSize: space?.size || 0,
        userId: user?.id || 0,
        totalAmount: total || 0,
        baseAmount: booking?.base_amount || 0,
        customerName: `${user?.first_name || ''} ${user?.last_name || ''}`,
        promotionName: bookingDetails?.promoCode?.value || '',
        siteName: bookingStore?.space?.site?.name || '',
        customerPhone: user?.phone_number || '',
        siteId: bookingStore?.space?.site?.id || '',
        customerEmail: user?.email || '',
        insuranceAmount: insurance || '',
        currency: country?.currency,
        country: country?.name,
        spaceId: space?.id || '',
        promotionStartDay: appliedPublicPromotion?.start_date || '',
        promoEndDate: appliedPublicPromotion?.end_date || '',
        platform: 'WEB',
        language: lang,
        spaceName: space?.name || '',
        status: appliedPublicPromotion?.status || '',
      };
      const eventName = IEventName.PROMOTION_APPLIED;
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.PROMOTION_APPLIED, errEvent);
    }
  };
  useEffect(() => {
    if (bookingStore?.space) {
      const keywords = JSON.parse(sessionStorage.getItem('keywords'));
      gtag.enhancedTrack({
        event: 'checkout',
        ecommerce: {
          checkout: {
            products: [{
              id: bookingStore?.space?.site?.id,
              price: bookingStore?.space?.prices?.[0].price_per_month,
              quantity: 1,
              email: user?.email || '',
              zipcode: '',
              keywords: keywords || [],
            }],
          },
        },
      });
    }
    if (appliedPublicPromotion) triggerPromotionAppliedEvent();
  }, [bookingStore?.space, appliedPublicPromotion]);

  const desktopRight = (
    <>
      <Box className={classes.rightSide}>
        {notAvailableToast}
        <StorageInfo subTotal={`${currencySign}${subTotal}`} />

        <ScheduleTime />
        <Divider />
        <PriceInfo {...priceProps} />
        {(!!appliedPublicPromotion && paymentSchedule.length > 0) && (
          <PaymentSchedule
            paymentSchedule={paymentSchedule}
          />
        )}
      </Box>
      {bookingStore.startTimer && (
        <Timer />
      )}
    </>
  );

  const onCloseHandler = () => {
    if (queryParam) {
      localStorage.removeItem('searchQueryParams');
      router.push({
        pathname: '/search',
        query: JSON.parse(queryParam),
      });
    }
  };

  const showAffiliateAlert = () => {
    if (bookingStore?.space?.site) {
      const { site } = bookingStore?.space;
      return site?.stock_management_type.includes(StockManagementType.AFFILIATE) && (
      <AffiliatePopup
        isPopUpOpen={isOpen}
        onClose={onCloseHandler}
        showCloseIcon={!!queryParam}
        onConfirm={() => {
          window.location.href = site.source_site_link;
        }}
      />
      );
    }
    return '';
  };

  const { SITE_DETAILS_A, SITE_DETAILS_B } = ISiteDetailsVersion;
  const version = isNewVersion ? SITE_DETAILS_B : SITE_DETAILS_A;

  return (
    <Grid container direction="row-reverse">
      <Grid item xs={12} sm={5} lg={5} xl={5}>
        {bookingStore.timerFinished && (
          <SessionExpiredPopup
            isPopUpOpen
            onConfirm={() => {
              router.push({
                pathname: !isBoxToBox
                  ? `/details/${bookingStore?.space?.site?.id}`.concat(`?version=${version}`)
                  : '/dark-storage',
                query: {
                  ...router.query,
                },
              });
            }}
          />
        )}

        {showAffiliateAlert()}

        {/* Desktop right side */}
        <Hidden xsDown>
          {/* Stick right box only after first step, on first step */}
          {/* right box is long and causing issues */}
          {bookingStore.currentStep === 0 ? (
            desktopRight
          ) : (
            <Sticky enabled top={10}>
              {desktopRight}
            </Sticky>
          )}
        </Hidden>

        {/* Mobile */}
        <Hidden smUp>
          <Box className={classes.rightSide}>
            {notAvailableToast}
            <StorageInfo subTotal={`${currencySign}${subTotal}`} />
            {bookingStore.currentStep === 0 && (
              <Box>
                <Promotions
                  promotionError={promotionError}
                  appliedPromotion={appliedPromotion}
                  appliedPublicPromotion={appliedPublicPromotion}
                  total={total}
                />
                <Divider />
              </Box>
            )}
          </Box>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={7} lg={7} xl={7}>
        <Box className={classes.leftSide}>
          <Hidden xsDown lgDown={isBoxToBox}>
            <Box mt={27} mb={4}>
              <Grey3Typography variant="h1">
                {t('grey3Typography')}
              </Grey3Typography>
            </Box>
          </Hidden>
          <Forms
            appliedPromotion={appliedPromotion}
            promotionError={promotionError}
            disableBtn={!!notAvailableToast}
            services={priceProps.services}
            setManPower={setManPower}
            manPower={manPower}
            appliedPublicPromotion={appliedPublicPromotion}
            total={total}
            user={user}
          />

          <Hidden smUp>
            <Box mt={30}>
              <Divider />
            </Box>
            <PriceInfo {...priceProps} />
            {!!appliedPublicPromotion && paymentSchedule.length > 0 && (
              <Box mb={10} mt={-5}>
                <PaymentSchedule paymentSchedule={paymentSchedule} hideEmbed />
              </Box>
            )}

            {bookingStore.startTimer && <Timer />}
          </Hidden>
        </Box>
      </Grid>
    </Grid>
  );
};

export default inject(BOOKING_STORE, AUTH_STORE_KEY, PROMOTION_STORE_KEY)(observer(Checkout));
