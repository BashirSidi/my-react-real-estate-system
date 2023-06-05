import {
  Box, makeStyles, fade, Typography, useMediaQuery, Theme,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import DayJS from 'dayjs';
import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { getTranslatedSizeUnit, useCurrentCountry, getTranslatedName } from 'utilities/market';
import { FixedCountry, SpaceStatus, StockManagementType } from 'typings/graphql.types';
import clsx from 'clsx';
import queryString from 'query-string';
import { IDynamicAdsParam } from 'typings/dynamic-ads.type';
import { GetPublicPromotionsQuery_promotions_edges_customer_buys } from 'modules/checkout/queries/__generated__/GetPublicPromotionsQuery';
import useCheckoutPrice from 'modules/checkout/hooks/useCheckoutPrice';
import { discountedPrice } from 'utilities/discountPriceFormat';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import IEventName from 'shared/event-name.enum';
import { useNewVersion } from 'hooks/useNewVersion';
import IFlagFeatures, { ISiteDetailsVersion } from 'shared/flag-features.enum';
import SpaceTypeDetails from '../SpacetypeDetails';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import SiteDetailStore, { SITE_DETAIL_STORE } from '../../stores/SiteDetailStore';
import { SitesListStore, SITES_STORE_KEY } from '../../../search/stores/SitesListStore';

import usePageTranslation from '../../../../hooks/usePageTranslation';
import AffiliateTypeform from '../AffiliateTypeform';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    background: 'white',
    width: '100%',
    zIndex: 99,
    bottom: 0,
    borderBottom: `1px solid ${fade(theme.palette.grey[100], 0.1)}`,
    marginLeft: '-13px',
    marginRight: '-28px',
    padding: '15px 28px 15px',
    borderTopRightRadius: '25px',
    borderTopLeftRadius: '25px',
    boxShadow: '0px 9px 40px rgba(51, 51, 51, 0.1)',
  },
  button: {
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 700,
    width: '100%',
    height: '50px',
    marginTop: '10px',
  },
  quote: {
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    marginTop: '10px',
    background: '#fff',
    '&:hover': {
      background: '#fff',
    },
  },
  priceBox: {
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',

    '& h3': {
      fontSize: '1.7rem',
      whiteSpace: 'nowrap',
    },
    '& h4': {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
  },
  sizeText: {
    color: theme.palette.grey[100],
    textAlign: 'right',
  },
  details: {
    fontSize: '12px',
    textDecoration: 'underline',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  oldPrice: {
    width: '100%',
    marginBottom: '0',
    color: theme.palette.grey[100],
    textDecoration: 'line-through',
    display: 'block',
  },
  updatePrice: {
    fontSize: '25px',
    lineHeight: '22px',
    marginTop: '5px',
  },
  pricebox: {
    marginTop: '7px',
  },
  span: {
    color: '#000000',
    fontWeight: 100,
  },
  bgOrange: {
    background: theme.palette.secondary.main,
    '&:focus, &:hover': {
      background: theme.palette.secondary.main,
    },
  },
  notCharged: {
    textAlign: 'center',
    fontWeight: 500,
    marginTop: 15,
    marginBottom: 10,
    lineHeight: 1,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
}));

interface IProps {
  store?: SiteDetailStore;
  [SITES_STORE_KEY]?: SitesListStore;
  [AUTH_STORE_KEY]?: AuthStore;
  checkedPromo?: number;
  promotions: GetPublicPromotionsQuery_promotions_edges_customer_buys[];
  goToSelectSize: () => void;
}

const MobileStickyBookWidget: React.FC<IProps> = ({
  store: {
    price, space, site, spaceTypes,
  }, sitesStore: { moveInDate }, auth,
  checkedPromo, promotions,
  goToSelectSize,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const { lang } = useTranslation();
  const [isTypeformOpen, setIsTypeformOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const currentCountry = useCurrentCountry();
  const featureName = IFlagFeatures.SITE_DETAILS_TEST;
  const featureValue = ISiteDetailsVersion.SITE_DETAILS_B;
  const isNewVersion = useNewVersion({ auth, featureName, featureValue });
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const { locale } = router;
  const translatedName = getTranslatedName(site, 'name', router.locale);
  const promoData = promotions.find((promo) => promo.id === checkedPromo);
  const {
    discountedAmount,
  } = useCheckoutPrice({
    spaceId: space?.id,
    moveInDate,
    promoId: promoData?.id,
    promoCode: null,
  });
  const { AFFILIATE } = StockManagementType;

  const goToCheckOut = () => {
    const eventName = IEventName.BOOK_NOW;
    const buttonText = isNewVersion
      ? 'PROCEED TO BOOKING' : 'BOOK NOW';
    try {
      const trackingPayload = {
        spaceSize: space?.size,
        spaceUnit: space?.size_unit,
        spaceId: space?.id,
        baseAmount: space?.prices[0]?.price_per_month,
        price,
        platform: 'WEB',
        siteName: translatedName,
        siteId: site?.id,
        country: currentCountry.name,
        language: lang,
        buttonText,
      };

      const dynamicAdsParams: IDynamicAdsParam = {
        content_type: 'home_listing',
        content_ids: [`${site?.id}`],
        neighborhood: site?.address?.district?.name_en,
        currency: currentCountry.currency,
        city: site.address?.city?.name_en,
        region: site.address?.city?.name_en,
        country: currentCountry.name,
        value: space?.prices[0]?.price_per_month,
      };

      gtag.track('InitiateCheckout', dynamicAdsParams);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(eventName, errEvent);
    }

    const query = {
      space_id: space?.id,
      move_in: router.query.move_in,
      promotion_id: checkedPromo,
      available_until: space?.stock_available_until
        ? DayJS(space?.stock_available_until).format('DD-MM-YYYY')
        : null,
      move_out: space?.stock_available_until
        ? DayJS(space?.stock_available_until).format('DD-MM-YYYY')
        : router.query.move_out,
    };
    if (router.query?.quotation) {
      // eslint-disable-next-line
      query['quotation'] = router.query.quotation as string;
    }
    router.push({
      pathname: '/checkout',
      query,
    });
  };

  const triggerEstimatorCT = () => {
    try {
      const trackingPayload = {
        districtName: site?.address?.district?.name_en || '',
        baseAmount: space?.prices[0]?.price_per_month || 0,
        customerEmail: auth?.user?.email || '',
        customerPhone: auth?.user?.phone_number || '',
        customerName: `${auth?.user?.first_name || ''} ${auth?.user?.last_name || ''}`,
        moveIn: moveInDate.toDate(),
        siteId: site?.id || 0,
        platform: 'WEB',
        country: currentCountry?.name,
        userId: auth?.user?.id || 0,
        currency: currentCountry?.currency,
        status: space?.status || SpaceStatus.ACTIVE,
        siteName: site?.name_en || '',
        spaceSize: space?.size || 0,
        value: space?.prices[0]?.price_per_month || 0,
      };
      const eventName = IEventName.LETS_ESTIMATE_CLICKED;
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.LETS_ESTIMATE_CLICKED, errEvent);
    }
  };

  const goToQuotation = () => {
    triggerEstimatorCT();
    const params = {
      space_id: space?.id,
      move_in: router.query.move_in,
      site_id: site?.id,
      district_id: site?.address?.district?.id,
      spaceType_id: space?.space_type?.id,
    };
    const url = `/get-a-quote?${queryString.stringify(params)}`;
    router.push(url);
  };

  const getQuoteHandler = () => {
    if (router.defaultLocale === 'ja') {
      setIsTypeformOpen(true);
      return;
    }
    goToQuotation();
  };

  const bookNowHandler = () => {
    if (site?.stock_management_type === AFFILIATE
      && currentCountry.name === FixedCountry.Japan) {
      setIsTypeformOpen(true);
      return;
    }
    goToCheckOut();
  };

  const { t } = usePageTranslation('details', 'MobileStickyBookWidget');
  return (
    <Box className={classes.root}>
      <Box>
        <Box className={clsx(classes.container)}>
          {space && !checkedPromo && (
            <Box className={classes.priceBox}>
              <Typography variant="h3">
                {price}
                /
              </Typography>
              <Typography variant="h4" className={classes.pricebox}>
                &nbsp;
                {t('typography4')}
              </Typography>
            </Box>
          )}
          {space && checkedPromo && (
            <Box className={classes.priceBox}>
              <Typography variant="h6" className={classes.oldPrice}>
                {price}
              </Typography>
              <Typography variant="h3" color="secondary" className={classes.updatePrice}>
                {discountedPrice(price, discountedAmount, router.locale)}
                <span className={classes.span}> /</span>
              </Typography>
              <Typography variant="h4" className={classes.pricebox}>
                &nbsp;
                {t('typography4')}
              </Typography>
            </Box>
          )}
          {space && (
            <Box>
              <Typography variant="body1" className={classes.sizeText}>
                {space?.size}
                &nbsp;
                {getTranslatedSizeUnit(space.size_unit, locale)}
              </Typography>
              <Typography
                onClick={() => setIsOpen(true)}
                className={classes.details}
                color="primary"
              >
                {t('unitDetails')}
              </Typography>
              <SpaceTypeDetails
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                spaceTypeId={space?.space_type?.id}
                spaceTypes={spaceTypes}
              />
            </Box>
          )}
        </Box>
        <Box className={classes.buttonsWrapper} flexDirection={!space ? 'row' : 'column'}>
          {isMobile && !space && site && site?.stock_management_type !== AFFILIATE
            && (
            <PrimaryButton
              className={clsx(classes.button, classes.quote)}
              onClick={getQuoteHandler}
              style={!site ? { border: 'none' } : {}}
              disabled={!site}
            >
              {t('primaryButton2')}
            </PrimaryButton>
            )}
          {!isNewVersion
            ? (
              <PrimaryButton
                onClick={bookNowHandler}
                disabled={!space}
                className={clsx(classes.button)}
              >
                {t(site?.stock_management_type !== AFFILIATE
                  ? 'primaryButton1' : 'secondaryButton1')}
              </PrimaryButton>
            )
            : (
              <>
                {
                  space
                    ? (
                      <Box display="flex" flexDirection="column" width="100%">
                        <Typography className={classes.notCharged}>{t('typography6')}</Typography>
                        <PrimaryButton
                          onClick={bookNowHandler}
                          disabled={!space}
                          className={clsx(classes.button, classes.bgOrange)}
                        >
                          {t(site?.stock_management_type !== AFFILIATE
                            ? 'primaryButton4' : 'secondaryButton1')}
                        </PrimaryButton>
                      </Box>
                    )
                    : (
                      <PrimaryButton onClick={goToSelectSize} className={classes.button}>
                        {t('primaryButton3')}
                      </PrimaryButton>
                    )
                }
              </>
            )}

          {(!isMobile || space) && site && site?.stock_management_type !== AFFILIATE
            && (
              <PrimaryButton
                className={clsx(classes.button, classes.quote)}
                onClick={getQuoteHandler}
                style={!site ? { border: 'none' } : {}}
                disabled={!site}
              >
                {t('primaryButton2')}
              </PrimaryButton>
            )}
        </Box>
        <AffiliateTypeform isOpen={isTypeformOpen} setIsOpen={setIsTypeformOpen} />
      </Box>
    </Box>
  );
};

export default inject(SITE_DETAIL_STORE, SITES_STORE_KEY)(observer(MobileStickyBookWidget));
