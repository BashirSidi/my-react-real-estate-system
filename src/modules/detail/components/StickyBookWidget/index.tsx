import {
  Box, makeStyles, Typography, fade, Grid,
} from '@material-ui/core';
import Sticky from 'react-stickynode';
import clsx from 'clsx';
import DayJS from 'dayjs';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { Skeleton } from '@material-ui/lab';
import ClevertapReact from 'clevertap-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import queryString from 'query-string';

import {
  FixedCountry, SpaceStatus, StockManagementType,
} from 'typings/graphql.types';
import { IDynamicAdsParam } from 'typings/dynamic-ads.type';
import { useCurrentCountry, getTranslatedName, getTranslatedSizeUnit } from 'utilities/market';
import Dimensions from 'components/Dimensions';
import useCheckoutPrice from 'modules/checkout/hooks/useCheckoutPrice';
import { discountedPrice } from 'utilities/discountPriceFormat';
import dynamic from 'next/dynamic';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { useNewVersion } from 'hooks/useNewVersion';
import IFlagFeatures, { ISiteDetailsVersion } from 'shared/flag-features.enum';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import styles from './StickyBookWidget.module.css';
import SiteDetailStore, { SITE_DETAIL_STORE } from '../../stores/SiteDetailStore';
import Image from '../../../../components/Image';
import { SitesListStore, SITES_STORE_KEY } from '../../../search/stores/SitesListStore';
import * as gtag from '../../../../utilities/gtag';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import Promotion from '../Promotion';
import MapView from './MapView';

import { GetPublicPromotionsQuery_promotions_edges_customer_buys } from '../../../checkout/queries/__generated__/GetPublicPromotionsQuery';
import AlertDiscount from '../AlertDiscount';
import SpaceTypeDetails from '../SpacetypeDetails';
import AffiliateTypeform from '../AffiliateTypeform';
import IEventName from '../../../../shared/event-name.enum';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';
import * as intercom from '../../../../utilities/intercom';

const SitesMap = dynamic(() => import('../../../search/containers/SitesMap'), { ssr: false });

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '50px',
    marginLeft: '60px',
    width: '350px',
    boxShadow: '0px 15px 40px rgba(51, 51, 51, 0.1)',
    background: 'white',
    borderRadius: '22px',
    padding: '0 30px 23px',
  },
  title: {
    padding: '15px 30px 11px',
    margin: '0 -30px',
    borderBottom: `1px solid ${fade(theme.palette.grey[100], 0.1)}`,
    fontSize: '1.6rem',
    display: 'flex',
    alignItems: 'center',
    '& img': {
      marginRight: '5px',
    },
  },
  location: {
    fontSize: '16px',
  },
  shoppingIcon: {
    display: 'flex !important',
    '& > svg': {
      height: '18px',
      width: '18px',
      '& > path': {
        fill: '#000',
      },
    },
  },
  priceBox: {
    padding: '16px 0 23px 0',
  },
  textContainer: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
  },
  disabled: {
    color: theme.palette.secondary.main,
    padding: '0 40px',
    textAlign: 'center',
  },
  quoteText: {
    color: theme.palette.primary.main,
    padding: '0 20px',
    textAlign: 'center',
  },
  button: {
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 700,
  },
  sizeContainer: {
    display: 'flex',
  },
  sizes: {
    whiteSpace: 'pre-wrap',
  },
  price: {
    fontSize: '22px',
    lineHeight: '23px',
    marginRight: '8px',
    marginTop: '12px',
  },
  spaceImage: {
    height: '97px',
    width: '113px',
    cursor: 'pointer',
  },
  iconsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  label: {},
  monthlyIcon: {
    marginBottom: '2.1rem',
  },
  monthlyText: {
    fontSize: '1.4rem',
  },
  clickable: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  details: {
    fontSize: '12px',
    textDecoration: 'underline',
    height: '32px',
    width: '125px',
    textAlign: 'center',
    cursor: 'pointer',
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
  oldPrice: {
    marginTop: '10px',
    marginBottom: '0',
    color: theme.palette.grey[100],
    textDecoration: 'line-through',
  },
  updatePrice: {
    fontSize: '25px',
    lineHeight: '22px',
    marginRight: '8px',
    marginTop: '5px',
  },
  dimension: {
    fontWeight: 400,
    fontSize: '1.4rem',
  },
  spaceBox: {
    marginLeft: '2rem',
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
    fontSize: '1.2rem',
    marginBottom: 10,
    lineHeight: 1,
  },
  fullWidth: {
    width: '100%',
  },
}));
interface IProps {
  store?: SiteDetailStore;
  [SITES_STORE_KEY]?: SitesListStore;
  [AUTH_STORE_KEY]?: AuthStore;
  location: string;
  loading: boolean;
  // eslint-disable-next-line max-len
  promotions: GetPublicPromotionsQuery_promotions_edges_customer_buys[];
  isOpenDiscount: boolean;
  goToSelectSize: () => void;
}

const StickyBookWidget: React.FC<IProps> = ({
  store: {
    space, price, site, spaceTypes,
  }, loading, location, promotions, auth,
  sitesStore: { moveInDate },
  isOpenDiscount,
  goToSelectSize,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const { lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTypeformOpen, setIsTypeformOpen] = useState(false);
  const currentCountry = useCurrentCountry();
  const featureName = IFlagFeatures.SITE_DETAILS_TEST;
  const featureValue = ISiteDetailsVersion.SITE_DETAILS_B;
  const isNewVersion = useNewVersion({ auth, featureName, featureValue });
  const translatedName = getTranslatedName(site, 'name', router.locale);
  const [checkedPromo, setCheckedPromo] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const goToSpaces = () => {
    const el = document.getElementById('spaceSelector');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const promoData: any = promotions?.find((promo) => promo.id === checkedPromo);

  const {
    discountedAmount,
    total,
  } = useCheckoutPrice({
    spaceId: space?.id,
    moveInDate,
    promoId: promoData?.id,
    promoCode: null,
  });

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

  const triggerEstimatorEvent = () => {
    try {
      const eventName = IEventName.LETS_ESTIMATE_CLICKED;
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
        value: 0,
      };
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.LETS_ESTIMATE_CLICKED, errEvent);
    }
  };

  const goToQuotation = () => {
    triggerEstimatorEvent();
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
    if (site?.stock_management_type === StockManagementType.AFFILIATE
      && currentCountry.name === FixedCountry.Japan) {
      setIsTypeformOpen(true);
      return;
    }
    goToCheckOut();
  };

  const { t } = usePageTranslation('details', 'StickyBookWidget');
  let isYearlyPromoSelected = false;
  let yearOrMonthText = t('months');
  let promotionPeriod = 0;
  if (checkedPromo) {
    // devide no. of days by 360 and see reminder if its 0, means its a yearly promotion
    isYearlyPromoSelected = ((promoData?.customer_buys[0]?.value) % 360) === 0;
    promotionPeriod = promoData?.customer_buys[0]?.value / 30;
    if (isYearlyPromoSelected) {
      promotionPeriod = promoData?.customer_buys[0]?.value / 30 / 12;
      yearOrMonthText = t('year');
    }
  }

  return (
    <Sticky
      enabled
      activeClass={styles.bookingbox__sticky_active}
      innerZ={100}
      top={20}
    >
      <Box>
        {showMap && <SitesMap showMap={showMap} setShowMap={setShowMap} />}
        <MapView setShowMap={setShowMap} />
      </Box>
      <Box className={clsx(classes.root, styles.bookingbox__sticky)}>
        <Box className={classes.title}>
          <Image name="location" folder="SearchLocation" />
          {!loading && (
            <Typography noWrap className={classes.location}>{location}</Typography>
          )}
          {loading && (
            <Skeleton height={22} width={200} animation="wave" variant="text" />
          )}
        </Box>
        <Box my={10}>
          {space && isNewVersion && (
            <Grid container>
              <Grid item sm={1} className={classes.iconsContainer}>
                <Box>
                  <Image name="home" folder="DetailPage" className={classes.shoppingIcon} asInlineEl />
                </Box>
              </Grid>
              <Grid item sm={5} className={classes.sizeContainer}>
                <Box display="flex" flexDirection="column">
                  <Box>
                    <Typography className={classes.label}>{t('typography5')}</Typography>
                  </Box>
                  <Box display="flex" alignItems="flex-end">
                    <Typography variant="h2" className={classes.price}>{space?.size}</Typography>
                    <Typography align="right" className={classes.label}>
                      {getTranslatedSizeUnit(space?.size_unit, router.locale)}
                    </Typography>
                  </Box>
                  <Box className={classes.sizes}>
                    <Dimensions
                      width={space.width}
                      height={space.height}
                      length={space.length}
                      unit={currentCountry.sizeUnitLength}
                      style={classes.dimension}
                    />
                  </Box>
                  <Typography className={classes.monthlyText} />
                </Box>
              </Grid>
              <Grid item sm={6}>
                <Box className={classes.spaceBox} onClick={() => setIsOpen(true)}>
                  <img src={space?.space_type?.icon} alt="" className={classes.spaceImage} />
                  <Typography color="primary" className={classes.details}>{t('unitDetails')}</Typography>
                </Box>
                <SpaceTypeDetails
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  spaceTypeId={space?.space_type?.id}
                  spaceTypes={spaceTypes}
                />
              </Grid>
              <Grid item sm={1} />
            </Grid>
          )}
        </Box>
        <Promotion
          promotionData={promotions}
          loading={loading}
          checkedPromo={checkedPromo}
          setCheckedPromo={setCheckedPromo}
          usePopover
        />
        <Box className={classes.priceBox}>
          {!space && moveInDate && (
            <Box className={classes.textContainer}>
              <Typography
                className={clsx(classes.disabled, classes.clickable)}
                onClick={goToSpaces}
              >
                {t('typography1')}
              </Typography>
              {site && site?.stock_management_type !== StockManagementType.AFFILIATE && (
                <>
                  <Typography>{t('or')}</Typography>
                  <Typography
                    className={clsx(classes.quoteText, classes.clickable)}
                    onClick={goToQuotation}
                  >
                    {t('typography2')}
                  </Typography>
                </>
              )}
            </Box>
          )}
          {!space && !moveInDate && (
            <Typography className={classes.disabled}>
              {t('typography3')}
            </Typography>
          )}
          {space && (
            <Grid container>
              <Grid item sm={1} className={classes.iconsContainer}>
                {!isNewVersion
                && (
                  <Box>
                    <Image name="home" folder="DetailPage" className={classes.shoppingIcon} asInlineEl />
                  </Box>
                )}
                <Box className={classes.monthlyIcon}>
                  <Image name="shopping" folder="DetailPage" className={classes.shoppingIcon} asInlineEl />
                </Box>
              </Grid>
              <Grid item sm={5} className={classes.sizeContainer}>
                <Box display="flex" justifyContent="space-between" flexDirection="column">
                  {!isNewVersion
                  && (
                  <>
                    <Box>
                      <Typography className={classes.label}>{t('typography5')}</Typography>
                    </Box>
                    <Box display="flex" alignItems="flex-end">
                      <Typography variant="h2" className={classes.price}>{space?.size}</Typography>
                      <Typography align="right" className={classes.label}>
                        {getTranslatedSizeUnit(space?.size_unit, router.locale)}

                      </Typography>
                    </Box>
                    <Box className={classes.sizes}>
                      <Dimensions
                        width={space.width}
                        height={space.height}
                        length={space.length}
                        unit={currentCountry.sizeUnitLength}
                        style={classes.dimension}
                      />
                    </Box>
                  </>
                  )}
                  {checkedPromo && promoData && (
                    <Typography className={classes.monthlyText}>
                      {t('typography4')}
                      {' ('}
                      {t('period', { promotion_period: promotionPeriod })}
                      {' '}
                      {yearOrMonthText}
                      {') '}
                    </Typography>
                  )}
                  {!checkedPromo && (
                    <Typography className={classes.monthlyText}>
                      {t('typography4')}
                    </Typography>
                  )}

                  {isNewVersion && (checkedPromo == null) && (
                  <Typography variant="h1" color="primary" className={classes.price}>
                    {price}
                  </Typography>
                  )}
                </Box>
              </Grid>
              {isNewVersion
              && (
              <Grid container>
                <Grid item sm={1} />
                <Grid item sm={11}>
                  {checkedPromo && total > 0 && (
                  <Box width="100%">
                    <Typography variant="h5" className={clsx(classes.oldPrice, classes.fullWidth)}>{price}</Typography>
                    <Typography variant="h1" color="secondary" className={clsx(classes.updatePrice, classes.fullWidth)}>{discountedPrice(price, discountedAmount, router.locale)}</Typography>
                  </Box>
                  )}
                </Grid>
              </Grid>
              )}
              {!isNewVersion
              && (
              <Grid item sm={6}>
                <Box className={classes.spaceBox} onClick={() => setIsOpen(true)}>
                  <img src={space?.space_type?.icon} alt="" className={classes.spaceImage} />
                  <Typography color="primary" className={classes.details}>{t('unitDetails')}</Typography>
                </Box>
                <SpaceTypeDetails
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  spaceTypeId={space?.space_type?.id}
                  spaceTypes={spaceTypes}
                />
              </Grid>
              )}
              <Grid item sm={1} />
              <Grid item sm={11}>
                {!isNewVersion && (checkedPromo == null) && (
                <Typography variant="h1" color="primary" className={classes.price}>
                  {price}
                </Typography>
                )}
                {!isNewVersion && checkedPromo && total > 0 && (
                  <Box>
                    <Typography variant="h5" className={classes.oldPrice}>{price}</Typography>
                    <Typography variant="h1" color="secondary" className={classes.updatePrice}>{discountedPrice(price, discountedAmount, router.locale)}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
        <Box>
          {!isNewVersion
            ? (
              <PrimaryButton
                disabled={!space}
                className={clsx(classes.button)}
                onClick={bookNowHandler}
              >
                {!site && !loading && t(currentCountry.name !== FixedCountry.Japan ? 'primaryButton1' : 'secondaryButton1')}
                {site && !loading && t(site.stock_management_type !== StockManagementType.AFFILIATE ? 'primaryButton1' : 'secondaryButton1')}
              </PrimaryButton>
            )
            : (
              <>
                { space
                  ? (
                    <Box display="flex" flexDirection="column">
                      <Typography className={classes.notCharged}>
                        {t('typography6')}
                      </Typography>
                      <PrimaryButton
                        disabled={!space}
                        className={clsx(classes.button, classes.bgOrange)}
                        onClick={bookNowHandler}
                      >
                        {!site && !loading && t(currentCountry.name !== FixedCountry.Japan ? 'primaryButton4' : 'secondaryButton1')}
                        {site && !loading && t(site.stock_management_type !== StockManagementType.AFFILIATE ? 'primaryButton4' : 'secondaryButton1')}
                      </PrimaryButton>
                    </Box>
                  )
                  : (
                    <PrimaryButton
                      disabled={loading}
                      onClick={goToSelectSize}
                      className={classes.button}
                    >
                      {t('primaryButton3')}
                    </PrimaryButton>
                  )}
              </>
            )}

        </Box>
        {site && site?.stock_management_type !== StockManagementType.AFFILIATE && (
          <Box>
            {!isOpenDiscount && (
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
        )}
      </Box>
      {isOpenDiscount && <AlertDiscount />}
      <AffiliateTypeform isOpen={isTypeformOpen} setIsOpen={setIsTypeformOpen} />
    </Sticky>
  );
};

export default inject(
  SITE_DETAIL_STORE,
  SITES_STORE_KEY, AUTH_STORE_KEY,
)(observer(StickyBookWidget));
