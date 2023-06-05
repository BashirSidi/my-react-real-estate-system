import {
  Grid, Theme, useMediaQuery,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { getTranslatedName, useCurrentCountry } from 'utilities/market';
import ClevertapReact from 'clevertap-react';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import { ITrackingSearch } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import SpaceTypesContainer from '../../../../containers/SpaceTypes';
import { SpaceTypesQuery_space_types_edges } from '../../../../queries/__generated__/SpaceTypesQuery';
import { SitesListStore } from '../../../../stores/SitesListStore';
import Option from './Option';
import AuthStore, { AUTH_STORE_KEY } from '../../../../../app/stores/AuthStore';

interface IProps {
  sitesStore?: SitesListStore;
  data: SpaceTypesQuery_space_types_edges[];
  [AUTH_STORE_KEY]?: AuthStore;
}

interface IPayLoad {
  auth: AuthStore;
  country: string;
  currency: string;
  sitesIds: string;
  spaceSize: string;
  sitesName: string;
}

const triggerEvent = (payload: IPayLoad) => {
  const eventName = IEventName.FILTERS_USED;
  const trackingPayload: ITrackingSearch = {
    customerEmail: payload?.auth?.user?.email,
    customerPhone: payload?.auth?.user?.phone_number,
    customerName: `${payload?.auth?.user?.first_name}${payload?.auth?.user?.last_name}`,
    userId: payload?.auth?.user?.id,
    currency: payload.currency,
    status: null,
    siteName: payload.sitesName,
    country: payload.country,
    type: 'Size',
  };
  gtag.track(eventName, trackingPayload);
  intercom.track(eventName, trackingPayload);
  ClevertapReact.event(eventName, trackingPayload);
};

const WrappedOptions: React.FC<IProps> = inject('sitesStore', AUTH_STORE_KEY)(observer(({ sitesStore, data, auth }) => {
  const isAutoApplied = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const { locale } = useRouter();
  const [viewed, setViewed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0 });
  const { name, currency } = useCurrentCountry();

  useEffect(() => {
    if (!viewed && inView) {
      setViewed(true);
    }
  }, [inView]);
  return (
    <Grid container spacing={3}>
      {data.map((type, i) => (
        <Grid key={type.name_en} item xs={4} sm={12} lg={12} xl={12}>
          <div ref={ref}>
            {viewed && (
            <Option
              id={type.id}
              htmlId={`size${i + 1}`}
              title={getTranslatedName(type, 'name', locale)}
              description={getTranslatedName(type, 'description', locale)}
              isSelected={sitesStore.filters.space_type === type.id}
              onSelect={(id) => {
                // If its already selected, remove it, otherwise select it
                const sitesIds = sitesStore.siteIds.map((siteId) => siteId).toString();
                const sitesName = sitesStore.sites.map((site) => site.name_en).toString();
                triggerEvent({
                  auth, country: name, currency, sitesIds, spaceSize: type.name_en, sitesName,
                });
                if (sitesStore.filters.space_type === id) {
                  sitesStore.removeFilter('space_type');
                } else {
                  sitesStore.setFilter('space_type', id);
                }

                if (isAutoApplied) {
                  sitesStore.applyFilters();
                }
              }}
              icon={type.icon}
              gif={type.gif}
              is_locker={type.is_locker}
              range_end={type.size_to}
              range_start={type.size_from}
              unit={type.unit}
            />
            )}
          </div>
        </Grid>
      ))}
    </Grid>
  );
}));

const Options: React.FunctionComponent = () => (
  <SpaceTypesContainer>
    {(data) => (
      <WrappedOptions data={data} />
    )}
  </SpaceTypesContainer>
);

export default Options;
