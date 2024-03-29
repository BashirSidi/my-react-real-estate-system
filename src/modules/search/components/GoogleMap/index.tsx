import React, { useEffect, useRef, useState } from 'react';
import { useCurrentCountry } from 'utilities/market';
import { DEFAULT_MAP_CENTER } from 'config';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import { IMapSite, ISite } from 'shared/interfaces';
import { SitesListStore, SITES_STORE_KEY } from 'modules/search/stores/SitesListStore';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';
import CustomMarker, { ISiteDetails } from './Marker';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';

export interface ICenter {
  lat: number;
  lng: number;
}

interface IProps {
  sites: ISite[];
  containerElement: React.ReactElement;
  mapElement: React.ReactElement;
  activeSiteId: number;
  setActiveSiteId: (activeSiteId: number) => void;
  zoom: number;
  goToSiteDetails: (siteDetails: ISiteDetails) => void;
  [SITES_STORE_KEY]?: SitesListStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const Map = withGoogleMap((props: IProps) => {
  const {
    activeSiteId, setActiveSiteId, zoom, goToSiteDetails,
    sitesStore,
  } = props;
  const mapRef = useRef<GoogleMap>();
  const { name } = useCurrentCountry();
  const router = useRouter();
  const [defaultCenter, setDefaultCenter] = useState(DEFAULT_MAP_CENTER[name]);
  const sites = sitesStore.markers || [];
  useEffect(() => {
    sitesStore.setMapRef(mapRef);
    sitesStore.fetchSiteMarkers(true);
  }, []);

  return (
    <GoogleMap
      zoom={zoom}
      ref={mapRef}
      defaultCenter={{
        lat: Number(router.query.lat) || defaultCenter.lat,
        lng: Number(router.query.lon) || defaultCenter.lng,
      }}
      options={{
        controlSize: 0,
        panControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: 'greedy',
        scrollwheel: false,
        disableDoubleClickZoom: true,
      }}
      onDragEnd={() => sitesStore.updatePolygon()}
    >
      {sitesStore.mapSites.length && sites?.map((site, idx) => (
        <CustomMarker
          key={idx}
          marker={site}
          setActiveSiteId={setActiveSiteId}
          isActive={activeSiteId === site?.id[0]}
          goToSiteDetails={goToSiteDetails}
        />
      ))}
    </GoogleMap>
  );
});

export default inject(SITES_STORE_KEY, AUTH_STORE_KEY)(observer(Map));
