import {
  Box, Theme, Typography, useMediaQuery,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
import SiteItem from '../../components/SiteItem';
import SpaceItem from '../../components/SpaceItem';
import { SitesListStore, SITES_STORE_KEY } from '../../stores/SitesListStore';
import { PromotionStore, PROMOTION_STORE_KEY } from '../../../checkout/stores/PromotionStore';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import filterSitesWithoutSpaces from '../../../../utilities/filterSitesWithoutSpaces';
import { getTranslatedName } from '../../../../utilities/market';

const SiteItemLoader = dynamic(() => import('../../components/SiteItemLoader'), { ssr: false });

interface IProps {
  [SITES_STORE_KEY]?: SitesListStore;
  [PROMOTION_STORE_KEY]?: PromotionStore
}

const SitesListContainer: React.FunctionComponent<IProps> = ({
  sitesStore, promotionStore: { publicPromotions },
}) => {
  const router = useRouter();
  const { t } = usePageTranslation('search', 'SitesList');
  const { hasMore } = sitesStore;
  const sites = filterSitesWithoutSpaces(sitesStore.sites);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Box mr={5} ml={5} mt={15}>
      {!!sites.length && (
        <Box ml={7} py={10}>
          <Typography variant="h3">
            {t('typography')}
          </Typography>
        </Box>
      )}
      <InfiniteScroll
        dataLength={sites.length}
        next={() => sitesStore.fetchSites()}
        hasMore={hasMore}
        loader={<SiteItemLoader />}
      >
        {sites.map((site, i) => (
          <SiteItem htmlId={`Site${i + 1}`} key={`${site.id}_${i}`} site={site} promotions={publicPromotions || []}>
            {site.spaces.edges.slice(0, 6).map((space) => (
              <SpaceItem key={space.id} {...space} />
            ))}
          </SiteItem>
        ))}
      </InfiniteScroll>
      {!isMobile
        && (
        <Box>
          <br />
          <br />
          <br />
        </Box>
        )}
    </Box>
  );
};

export default inject(SITES_STORE_KEY, PROMOTION_STORE_KEY)(observer(SitesListContainer));
