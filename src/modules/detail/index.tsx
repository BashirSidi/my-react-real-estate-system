import { useQuery } from '@apollo/client';
import {
  Box, Grid, Hidden, Theme, useMediaQuery,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useState, useEffect, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import ClevertapReact from 'clevertap-react';
import dynamic from 'next/dynamic';
import DayJS from 'components/DayJS';
import { inject, observer } from 'mobx-react';
import { IDynamicAdsParam } from 'typings/dynamic-ads.type';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import * as branch from 'utilities/branch';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { BOX_TO_BOX } from 'config';
import { SiteStatus, SpaceStatus } from 'typings/graphql.types';
import IEventName from 'shared/event-name.enum';
import * as intercom from 'utilities/intercom';
import { useCurrentCountry, getTranslatedName } from 'utilities/market';
import { useNewVersion } from 'hooks/useNewVersion';
import IFlagFeatures, { ISiteDetailsVersion } from 'shared/flag-features.enum';
import * as gtm from 'utilities/gtag';
import * as gtag from '../../utilities/gtag';
import Breadcrumbs from './components/Breadcrumbs';
import AvailableUnits from './components/AvailableUnits';
import CostWithButton from './components/CostWithButton';
import Description from './components/Description';
import Footer from './components/Footer';
import FrequentlyAskedQuestions from './components/FrequentlyAskedQuestions';
import Header from './components/Header';
import HelpMenu from './components/HelpMenu';
import HowItWorks from './components/HowItWorks';
import Location from './components/Location';
import LocationMap from './components/Map';
import Rating from './components/Rating';
import SiteAmenities from './components/SiteAmenities';
import StickyBookWidget from './components/StickyBookWidget';
import Title from './components/Title';
import { SIMILAR_STORAGE_QUERY, SITE_REVIEWS_QUERY } from './queries';
import { SiteReviewsQuery, SiteReviewsQueryVariables } from './queries/__generated__/SiteReviewsQuery';
import MobileStickyBookWidget from './components/MobileStickyBookWidget';
import SimilarStorage from './components/SimilarStorages';
import Promotion from './components/Promotion';
import { GET_PUBLIC_PROMOTIONS } from '../checkout/queries';
import { GetPublicPromotionsQuery } from '../checkout/queries/__generated__/GetPublicPromotionsQuery';
import { filterPromotions } from '../../utilities/promotions';
import usePageTranslation from '../../hooks/usePageTranslation';
import { Intercom, IIntercomClevertapPayload } from '../../components/Intercom';
import {
  SimilarStorageQuery,
  SimilarStorageQueryVariables,
} from './queries/__generated__/SimilarStorageQuery';
import SiteDetailStore, { SITE_DETAIL_STORE } from './stores/SiteDetailStore';
import DialogDiscount from './components/DialogDiscount';
import AlertDiscount from './components/AlertDiscount';

const Reviews = dynamic(() => import('./components/Reviews'), { ssr: false });

interface IProps {
  siteId: number;
  spaceId: number;
  [SITE_DETAIL_STORE]?: SiteDetailStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const Details: React.FC<IProps> = ({
  siteId, spaceId, store, auth,
}) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { lang } = useTranslation();
  const { t } = usePageTranslation('details', 'Details');
  const { site, loading, space } = store;
  const [isMounted, setIsMounted] = useState(false);
  const country = useCurrentCountry();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
  const [checkedPromo, setCheckedPromo] = useState(null);
  const featureName = IFlagFeatures.SITE_DETAILS_TEST;
  const { SITE_DETAILS_A, SITE_DETAILS_B } = ISiteDetailsVersion;
  const featureValue = ISiteDetailsVersion.SITE_DETAILS_B;
  const isNewVersion = useNewVersion({ auth, featureName, featureValue });

  if ([BOX_TO_BOX, 'Dark Storage'].includes(site?.name_en)) {
    router.push('/dark-storage');
  }
  useEffect(() => {
    setIsMounted(true);
    const moveInDate = router?.query?.move_in ? DayJS(router?.query?.move_in as string, 'DD-MM-YYYY').format('YYYY-MM-DD') : DayJS().add(1, 'day').format('YYYY-MM-DD');
    store.getSiteDetails(siteId, moveInDate, { id: country.id, name: country.name });
  }, [router.asPath]);

  const getPath = () => {
    const { query, asPath, basePath } = router;
    delete query?.version;
    const urlLastPart = Object.keys(query).map((k) => `${k}=${query[k]}`);
    const re = new RegExp('(\\/details\\/\\d+)');
    const version = isNewVersion ? SITE_DETAILS_B : SITE_DETAILS_A;
    return asPath.match(re)?.[0]?.concat(`?${urlLastPart.join('&')}`)?.concat(`&version=${version}`);
  };

  useEffect(() => {
    // send GTM event <page view> based on the  site details page version
    const id = setTimeout(() => gtm.pageview(getPath()), 5000);
    return () => clearTimeout(id);
  }, [isNewVersion]);

  const {
    loading: promotionLoading,
    data: promotionData,
  } = useQuery<GetPublicPromotionsQuery>(GET_PUBLIC_PROMOTIONS);
  let publicPromos = [];

  if (siteId) {
    publicPromos = filterPromotions(promotionData?.promotions?.edges, siteId);
  }
  const address = site?.address;
  const districtID = address?.district.id || 0;
  const quotationId = router?.query?.quotation ? String(router.query.quotation) : null;

  const {
    data: sites,
    loading: fetchingReviews,
  } = useQuery<SiteReviewsQuery, SiteReviewsQueryVariables>(SITE_REVIEWS_QUERY, {
    variables: { siteId, quotationId, reqQuotations: !!quotationId },
  });

  const {
    data: similarStorageData,
    loading: similarStorageLoading,
  } = useQuery<SimilarStorageQuery, SimilarStorageQueryVariables>(SIMILAR_STORAGE_QUERY, {
    variables: {
      skip: 0,
      limit: 9,
      districtId: { _eq: districtID },
      status: { _eq: SiteStatus.ACTIVE },
    },
    skip: !address?.district.id,
  });

  if (!site && !loading && isMounted) {
    router.replace('/404');
  }

  const getLocation = () => [
    getTranslatedName(address?.district, 'name', router.locale) || '',
    getTranslatedName(address?.city, 'name', router.locale) || '',
  ].filter((s) => !!s).join(', ');

  const checkDiscount = !!sites?.sites?.edges?.[0].quotation;

  useEffect(() => {
    try {
      if (!loading && site && isMounted) {
        const features = site?.features.map((feature) => feature.name_en);
        const trackingPayload = {
          siteId: site?.id,
          siteName: site?.name_en,
          siteAmenities: features?.join() || '',
          featured: site?.is_featured,
          district: site?.address?.district?.name_en || '',
          language: lang,
          platform: 'WEB',
          country: country.name,
        };

        const dynamicAdsParams: IDynamicAdsParam = {
          content_type: 'home_listing',
          content_ids: [`${site?.id}`],
          neighborhood: address?.district?.name_en,
          city: address?.city?.name_en,
          region: address?.city?.name_en,
          country: country.name,
        };

        gtag.track('ViewContent', dynamicAdsParams);
        intercom.track(IEventName.SITE_VIEW, trackingPayload);
        branch.track(IEventName.SITE_VIEW, trackingPayload);
        ClevertapReact.event(IEventName.SITE_VIEW, trackingPayload);
        gtag.enhancedTrack({
          ecommerce: {
            detail: {
              products: [{
                id: site?.id,
              }],
            },
          },
        });
      }
    } catch (errEvent) {
      logErrorCleverTap(IEventName.SITE_VIEW, errEvent);
    }
  }, [site, loading, isMounted]);

  const trackingPayload: IIntercomClevertapPayload = {
    type: 'intercom',
    customerEmail: auth?.user?.email,
    customerPhone: auth?.user?.phone_number,
    customerName: `${auth?.user?.first_name ?? 'anonymous'}${auth?.user?.last_name ?? ''}`,
    userId: auth?.user?.id || null,
    currency: country.currency,
    status: null,
    siteName: site?.name_en ?? 'detail-page',
    country: country.name,
  };

  const trackingVirtualViewPayload = {
    discountAmount: 0,
    totalAmount: 0,
    depositAmount: 0,
    subTotalAmount: 0,
    baseAmount: 0,
    customerEmail: auth?.user?.email || '',
    customerPhone: auth?.user?.phone_number || '',
    customerName: `${auth?.user?.first_name}${auth?.user?.last_name}` || '',
    insuranceAmount: 0,
    siteId: site?.id || '',
    platform: 'WEB',
    country: country.name,
    userId: auth?.user?.id || '',
    currency: country?.currency || '',
    status: space?.status || SpaceStatus.ACTIVE,
    siteName: site?.name_en || '',
    spaceSize: space?.size || '',
  };

  const trackVirtualView = () => {
    try {
      const eventName = IEventName.VIRTUAL_VIEW_CLICKED;
      gtag.track(eventName, trackingVirtualViewPayload);
      intercom.track(eventName, trackingVirtualViewPayload);
      ClevertapReact.event(eventName, trackingVirtualViewPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.VIRTUAL_VIEW_CLICKED, errEvent);
    }
  };

  const goToSelectSize = () => ref?.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });

  return (
    <>
      <Head>
        <title>
          {t('title', { site: getTranslatedName(site, 'name', router.locale) ?? '' })}
        </title>
        <meta name="title" content={t('title', { site: getTranslatedName(site, 'name', router.locale) ?? '' })} />
      </Head>
      {isMobile && checkDiscount && <AlertDiscount />}
      <Header
        url3d={sites?.sites?.edges?.[0].url_3d?.[0]?.url}
        trackVirtualView={trackVirtualView}
        images={site?.images || []}
        loading={loading}
      />
      <Box ml={6} mr={6}>
        <Breadcrumbs
          name={getTranslatedName(site, 'name', router.locale)}
          isFeatured={site?.is_featured}
          loading={loading}
          city={getTranslatedName(address?.city, 'name', router?.locale)}
        />
        <Intercom trackingPayload={trackingPayload} />
        <Grid container>
          <Grid item xs={12} sm={7} lg={7}>
            <Box ml={8} mr={8}>
              <Location location={getLocation()} loading={loading} />
              <Hidden smUp>
                <Promotion
                  promotionData={publicPromos}
                  loading={promotionLoading}
                  checkedPromo={checkedPromo}
                  setCheckedPromo={setCheckedPromo}
                />
              </Hidden>
              <Title loading={loading} name={getTranslatedName(site, 'name', router.locale)} />
              <Rating setIsOpen={setIsOpen} site={site} />
              <Reviews
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                site={sites?.sites?.edges?.[0]}
              />
              <Description description={getTranslatedName(site, 'description', router.locale)} loading={loading} />
              <SiteAmenities features={site?.features || []} loading={loading} />
            </Box>
            <Hidden smUp>
              <MobileStickyBookWidget
                checkedPromo={checkedPromo}
                promotions={publicPromos}
                goToSelectSize={goToSelectSize}
              />
            </Hidden>
            { isNewVersion
              ? (
                <div ref={ref}>
                  <AvailableUnits siteId={siteId} spaceId={spaceId} />
                </div>
              )
              : <AvailableUnits siteId={siteId} spaceId={spaceId} />}
            <LocationMap
              loading={loading}
              coords={{ lat: address?.lat || 0, lng: address?.lng || 0 }}
            />
          </Grid>
          <Hidden only="xs">
            <Grid item sm={5}>
              <StickyBookWidget
                location={getLocation()}
                loading={loading}
                promotions={publicPromos}
                isOpenDiscount={checkDiscount}
                goToSelectSize={goToSelectSize}
              />
            </Grid>
          </Hidden>
        </Grid>
        <HowItWorks />
        <SimilarStorage
          data={similarStorageData}
          loading={similarStorageLoading}
        />
        <FrequentlyAskedQuestions />
        <CostWithButton />
        <HelpMenu />
        <Footer />
        {checkDiscount && <DialogDiscount />}
      </Box>
    </>
  );
};

export default inject(SITE_DETAIL_STORE, AUTH_STORE_KEY)(observer(Details));
