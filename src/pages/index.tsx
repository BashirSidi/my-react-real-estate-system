import React, { useState, useEffect } from 'react';
import { inject, observer, Provider as MobxProvider } from 'mobx-react';
import { makeStyles, useMediaQuery, Theme } from '@material-ui/core/';
import Head from 'next/head';
import { FixedCountry } from 'typings/graphql.types';
import { useCurrentCountry } from 'utilities/market';
import { setLocalStorage } from 'utilities/localStorage';
import { UPDATE_PROFILE_MUTATION } from 'modules/account/queries';
import { updateProfile, updateProfileVariables } from 'modules/account/queries/__generated__/updateProfile';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useFlagsmith } from 'flagsmith-react';
import IFlagFeatures from 'shared/flag-features.enum';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import { APP_ENV, INTERCOM_APP_ID } from 'config';
import useTranslation from 'next-translate/useTranslation';
import { getCurrentAnonymousUserId } from 'utilities/user';
import * as clevertap from 'utilities/clevertap';
import { SitesListStore } from '../modules/search/stores/SitesListStore';

import { HomeLayout } from '../layouts/MainLayout';
import SquareGuides from '../modules/home/components/SquareGuides';
import SearchHeader from '../modules/home/components/SearchHeader';
import WhatMakesUsDifferent from '../modules/home/components/WhatMakesUsDifferent';
import Reviews from '../modules/home/components/Reviews';
import HostASpace from '../modules/home/components/HostASpace';
import HowItWorks from '../modules/home/components/HowItWorks';
import Footer from '../components/Footer';
import FeaturedListings from '../modules/home/components/FeaturedListings';
import usePageTranslation from '../hooks/usePageTranslation';
import { Intercom, IIntercomClevertapPayload } from '../components/Intercom';
import DarkStorage from '../modules/home/components/DarkStorage';

declare global {
  interface Window {
    Intercom:any;
  }
}

const useStyles = makeStyles(() => ({
  override: {
    padding: 'unset',
    margin: 'unset !important',
    maxWidth: '100vw !important',
  },
  container: {
    minHeight: '100vh',
    width: '100%',
  },
  ref: {
    minHeight: '100px',
    width: '100%',
  },
}));

interface IProps {
  [AUTH_STORE_KEY]?: AuthStore;
}

const Home: React.FunctionComponent<IProps> = ({ auth }) => {
  const classes = useStyles();
  const { lang } = useTranslation();
  const { name, currency } = useCurrentCountry();
  const [store] = useState(new SitesListStore());
  const { hasFeature, identify, isLoading } = useFlagsmith();
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  const { t } = usePageTranslation('home', 'Home');
  const [updateProfileMutation] = useMutation<updateProfile, updateProfileVariables>(
    UPDATE_PROFILE_MUTATION,
  );
  const breadCrumbs = [{ title: t('navHome'), link: '/' }];
  setLocalStorage('breadCrumbs', JSON.stringify(breadCrumbs));
  useEffect(() => {
    const userId = auth?.user?.id
      ? `${APP_ENV}_${auth?.user?.id}` : getCurrentAnonymousUserId();
    const traits = {
      user_id: userId,
      country: name,
      language: lang,
      email: auth?.user?.email ?? '',
      phone: auth?.user?.phone_number ?? '',
    };

    if (typeof window !== 'undefined') {
      const appId = INTERCOM_APP_ID;
      window?.Intercom('boot', {
        app_id: appId,
        email: auth?.user?.email,
        created_at: Math.floor(Date.now() / 1000),
        name: auth?.user?.first_name ?? 'Anonymous',
        user_id: auth?.user?.id,
      });
    }

    if (!isLoading) identify(userId, traits);
    if (auth?.user?.id) {
      updateProfileMutation({
        variables: {
          payload: {
            preferred_language: router.locale,
          },
        },
      });
    }
  }, [auth?.user?.id, isLoading]);

  useEffect(() => {
    const userId = auth?.user?.id ?? getCurrentAnonymousUserId();
    const payload = {
      auth,
      userId,
      countryName: name,
      language: lang,
    };
    clevertap.identifyUser(payload);

    // eslint-disable-next-line
  }, []);

  const trackingPayload: IIntercomClevertapPayload = {
    type: 'intercom',
    customerEmail: auth?.user?.email,
    customerPhone: auth?.user?.phone_number,
    customerName: `${auth?.user?.first_name ?? 'anonymous'}${auth?.user?.last_name ?? ''}`,
    userId: auth?.user?.id || null,
    currency,
    status: null,
    siteName: 'Home',
    country: name,
  };

  // verification domain
  let facebookVerificationId = null;
  if (name === FixedCountry.Thailand) {
    facebookVerificationId = '0bijis249k9ofupirsuc3wxou7eod9';
  }
  if (name === FixedCountry.Japan) {
    facebookVerificationId = '4v0off56mp6ssw6w11kq0y2fss2moq';
  }

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="title" content={t('metaTitle')} />
        <meta name="description" content={t('description')} />
        {
          facebookVerificationId && <meta name="facebook-domain-verification" content={facebookVerificationId} />
        }
        {isMobile
          ? <link rel="preload" as="image" href={`/images/${name}/Homepage/banner-mobile.webp`} />
          : <link rel="preload" as="image" href={`/images/${name}/Homepage/banner-desktop.webp`} />}
      </Head>
      <Intercom trackingPayload={trackingPayload} />
      <MobxProvider sitesStore={store}>
        <HomeLayout className={classes.override}>
          <div className={classes.container}>
            <SearchHeader />
            <FeaturedListings />
            <HowItWorks />
          </div>
          <div>
            <SquareGuides />
            {hasFeature(IFlagFeatures.DARK_STORAGE)
              && name === FixedCountry.Singapore && <DarkStorage />}
            <WhatMakesUsDifferent />
            <Reviews />
            <HostASpace />
            <Footer />
          </div>
        </HomeLayout>
      </MobxProvider>
    </>
  );
};

export default inject(AUTH_STORE_KEY)(observer(Home));
