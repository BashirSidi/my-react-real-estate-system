import {
  Box, Grid, Hidden, makeStyles, Typography,
} from '@material-ui/core';
import {
  useEffect, useMemo, useState,
} from 'react';
import { Skeleton } from '@material-ui/lab';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import { inject, observer } from 'mobx-react';
import { Dayjs } from 'dayjs';
import queryString from 'query-string';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import ClevertapReact from 'clevertap-react';
import scrollIntoView from 'scroll-into-view';
import { StockManagementType, SpaceStatus } from 'typings/graphql.types';
import { useCurrentCountry } from 'utilities/market';
import { ISpace, ISpaceType } from 'shared/interfaces';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import IEventName from 'shared/event-name.enum';
import AuthStore, { AUTH_STORE_KEY } from '../../../../app/stores/AuthStore';
import Image from '../../../../../components/Image';
import Size from './Size';
import SquareGuidesModal from './model';
import SiteDetailStore, { SITE_DETAIL_STORE } from '../../../stores/SiteDetailStore';
import SoldOut from '../../../../../components/SoldOut';
import Filter from './Filters';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const useStyles = makeStyles((theme) => ({
  root: {},
  helpBox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30px',
    marginBottom: '40px',
    '& img': {
      marginRight: '8px',
    },
    '& p': {
      color: theme.palette.grey[100],
    },

    [theme.breakpoints.only('xs')]: {
      marginTop: '20px',
      marginBottom: '20px',
    },
  },
  loader: {
    borderRadius: '22px',
    height: '60px',
    width: '155px',
    marginBottom: '20px',

    [theme.breakpoints.only('xs')]: {
      height: '30px',
      width: '70px',
    },
  },
  sizeList: {
    maxWidth: '500px',
    marginBottom: '40px',
    marginLeft: 16,

    [theme.breakpoints.only('xs')]: {
      marginBottom: '20px',
      marginLeft: 0,

    },
  },
  unitsWrapper: {
    border: `1px solid ${theme.palette.grey[50]}`,
    borderRadius: '21px',
    padding: '0 24px 24px',

    [theme.breakpoints.down('sm')]: {
      padding: '0 18px 24px',
    },
  },
  messageTitle: {
    '& img': {
      position: 'relative',
      top: '4px',
      marginRight: '15px',
    },
  },
  message: {
    display: 'flex',
    maxWidth: '500px',
    margin: '20px 0',
    padding: '10px 25px',
    background: theme.palette.secondary.light,
    borderRadius: '15px',

    '& img': {
      marginRight: '10px',
    },
    '&:last-child': {
      color: theme.palette.secondary.main,
    },
  },
  estimate: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  spaceText: {
    color: theme.palette.secondary.main,
  },
  or: {
    color: 'black',
    textDecoration: 'none',
  },
  quoteText: {
    color: theme.palette.primary.main,
  },
  clickable: {
    textDecoration: 'underline',
    cursor: 'pointer',
    textAlign: 'right',
  },
}));

interface IProps {
  siteId: number;
  spaceId: number;
  moveInDate: Dayjs;
  moveOutDate: Dayjs;
  store?: SiteDetailStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const SpaceSelector: React.FC<IProps> = ({
  siteId, store: {
    space, site,
  },
  store, moveInDate, moveOutDate, spaceId, auth,
}) => {
  const classes = useStyles();
  const [selectedItem, setSelectedItem] = useState<number>(null);
  const [selectedSpace, setSelectedSpace] = useState<ISpace>(null);
  const [spaceType, setSpaceType] = useState<number>(null);

  const currentCountry = useCurrentCountry();
  const router = useRouter();
  const [isOpenSquareGuide, setIsOpenSquareGuide] = useState(false);
  const loading = store?.loading;
  const spaces = store?.site?.spaces.edges;

  const items = useMemo(
    () => sortBy((spaces || []).filter((s) => s.available_units !== 0), (s) => s.size),
    [spaces, loading],
  );

  const goToSpaces = () => {
    const el = document.getElementById('spaceSelector');
    if (el) {
      scrollIntoView(el, {
        align: {
          topOffset: -350,
        },
      });
    }
  };

  const triggerEstimatorCT = () => {
    try {
      const trackingPayload = {
        districtName: site?.address?.district?.name_en || '',
        baseAmount: space?.prices[0]?.price_per_month || 0,
        customerEmail: auth?.user?.email || '',
        customerPhone: auth?.user?.phone_number || '',
        customerName: `${auth?.user?.first_name || ''} ${auth?.user?.last_name || ''}`,
        moveIn: moveInDate,
        siteId: site?.id || 0,
        platform: 'WEB',
        country: currentCountry?.name,
        userId: auth?.user?.id || 0,
        currency: currentCountry?.currency,
        status: space?.status || SpaceStatus.ACTIVE,
        siteName: site?.name_en || '',
        spaceSize: space?.size || 0,
        quotationId: '',
        createdAt: '',
        value: space?.prices[0]?.price_per_month || 0,
        spaceId: space?.id || 0,
        expiredAt: '',
        pageUrl: '',
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

  const getGroupedItems = (): ISpaceType[] => {
    const obj = groupBy(items, (i) => i.space_type?.id);
    const types = [];
    Object.keys(obj).forEach((id) => {
      if (obj?.[id]?.[0]?.space_type) {
        types.push(obj[id][0]?.space_type);
      }
    });
    return types;
  };
  const types = useMemo(() => getGroupedItems(), [store.site, loading]);
  const { t } = usePageTranslation('details', 'SpaceSelector');
  const toggleModal = () => setIsOpenSquareGuide(!isOpenSquareGuide);

  useEffect(() => {
    if (spaceId) {
      const newSelectedSpace = items.filter((i) => i.id === spaceId)[0];
      store?.setSelectedSpace(newSelectedSpace);
      setSelectedItem(newSelectedSpace?.id);
      setSpaceType(newSelectedSpace?.space_type?.id);
    }
  }, [loading]);

  if (!moveInDate) {
    return null;
  }

  return (
    <Box className={classes.root}>
      {!!items.length && (
        <>
          <Box ml={8} mr={8}>
            <Box>
              <Box className={classes.helpBox}>
                <Image name="help" folder="SearchLocation" />
                <Typography
                  variant="body1"
                  className={classes.estimate}
                  onClick={toggleModal}
                  id="openSquareGuidesModal"
                >
                  {t('body1')}
                </Typography>
                <SquareGuidesModal isOpen={isOpenSquareGuide} toggleModal={toggleModal} />
              </Box>
            </Box>
            <Box id="spaceSelector">
              <Typography variant="h3" className={classes.messageTitle}>
                <Image folder="DetailPage" name="home" />
                {t('h3')}
              </Typography>
              <Hidden smUp>
                <Box className={clsx(classes.container)}>
                  {!space && moveInDate && (
                  <Typography>
                    <span
                      role="presentation"
                      className={clsx(classes.clickable, classes.spaceText)}
                      onClick={goToSpaces}
                    >
                      {t('typography1')}
                    </span>
                    {site && site?.stock_management_type !== StockManagementType.AFFILIATE && (
                    <>
                      <span
                        role="presentation"
                        className={classes.or}
                      >
                        {' '}
                        {t('or')}
                      </span>
                      <span
                        role="presentation"
                        className={clsx(classes.clickable, classes.quoteText)}
                        onClick={goToQuotation}
                        color="primary"
                      >
                        {t('typography2')}
                      </span>
                    </>
                    )}
                  </Typography>
                  )}
                  {!space && !moveInDate && (
                  <Typography color="secondary">
                    {t('typography3')}
                  </Typography>
                  )}
                </Box>
              </Hidden>
              <Box className={classes.message}>
                <Image folder="DetailPage" name="alert" />
                <Typography variant="body2">
                  {t('body2')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {!loading && (
            <Box className={classes.sizeList}>
              <Box className={classes.unitsWrapper}>
                <Filter onSelect={setSpaceType} types={types}>
                  {items.filter((f) => f.space_type?.id === spaceType).map((item, i) => (
                    <Grid key={i} item xs={12} sm={12}>
                      <Size
                        space={item}
                        siteId={siteId}
                        isSelected={selectedItem === item.id}
                        selectedSpace={selectedSpace}
                        onToggle={(isSelected) => {
                          setSelectedItem(isSelected ? item.id : null);
                          setSelectedSpace(isSelected ? item : null);
                          store?.setSelectedSpace(isSelected ? item : null);
                        }}
                      />
                    </Grid>
                  ))}
                </Filter>
              </Box>
            </Box>
          )}
        </>
      )}

      {!items.length && !loading && (
        <>
          <br />
          <SoldOut />
        </>
      )}

      <Box className={classes.sizeList}>
        {loading && (
          <>
            <br />
            <Grid container>
              <Grid item xs={3} sm={6}>
                <Skeleton className={classes.loader} variant="rect" animation="wave" />
              </Grid>
              <Grid item xs={3} sm={6}>
                <Skeleton className={classes.loader} variant="rect" animation="wave" />
              </Grid>
              <Grid item xs={3} sm={6}>
                <Skeleton className={classes.loader} variant="rect" animation="wave" />
              </Grid>
              <Grid item xs={3} sm={6}>
                <Skeleton className={classes.loader} variant="rect" animation="wave" />
              </Grid>
            </Grid>
          </>
        )}

      </Box>
    </Box>
  );
};

export default inject(SITE_DETAIL_STORE)(observer(SpaceSelector));
