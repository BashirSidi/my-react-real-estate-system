import {
  Box, fade, Hidden, makeStyles, Slider, Theme, Typography, useMediaQuery, withStyles,
} from '@material-ui/core';
import debounce from 'lodash/debounce';
import { inject, observer } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
import formatterMoney from 'utilities/formatterMoney';
import ClevertapReact from 'clevertap-react';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import { ITrackingSearch } from 'shared/interfaces';
import { WithStylesOptions } from '@material-ui/styles';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import { SitesListStore, SITES_STORE_KEY } from '../../../stores/SitesListStore';
import { useCurrentCountry } from '../../../../../utilities/market';

const useStyles = makeStyles<Theme, { pricerangereached: boolean }, any>((theme) => ({
  root: {
    position: 'relative',
    margin: '26px 26px 0',
    borderBottom: `1px solid ${fade(theme.palette.grey[100], 0.1)}`,
    maxWidth: 298.91,
    [theme.breakpoints.up('sm')]: {
      height: '171px',
      border: `1px solid ${theme.palette.grey[50]}`,
      margin: '17px 26px 0',
      borderRadius: '12px',
      padding: '20px 20px 0',
      '& h4': {
        ...theme.typography.body1,
      },
    },
  },
  sliderBox: {
    position: 'relative',
    margin: '54px 28px 0',
    [theme.breakpoints.up('sm')]: {
      margin: '56px 28px 0',
    },
    '& > span > span:last-child::after': {
      content: '" " !important',
      position: 'absolute',
      width: 10,
      display: (props) => (props?.pricerangereached ? 'block' : 'none'),
      borderRadius: 2,
      height: 1.5,
      top: -30,
      left: -23,
      backgroundColor: '#FFF',
      zIndex: 3,
    },
  },
  sliderBottomText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '90%',
    marginBottom: 15,
    '& > h6:last-child': {
      marginRight: 5,
    },
  },
  title: {
    padding: '0 30px',
  },
}));

const CustomSlider = withStyles<
any,
WithStylesOptions<Theme> & { pricerangereached: boolean },
any>((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    height: '8px',
    '& input + span + span': {
      left: '-20px !important',
      [theme.breakpoints.up('sm')]: {
        left: '-25px !important',
      },
    },
  },
  thumb: {
    height: '20px',
    width: '20px',
    marginTop: '-8px',
    marginLeft: '-12px',
    backgroundColor: '#FFFFFF',
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-160%)',
    '& *': {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      fontSize: '1.2rem',
      borderRadius: 12,
      width: 70,
      textAlign: 'center',
      transform: 'rotate(0deg)',
      lineHeight: 1,
    },
    '& *::after': {
      width: 20,
      height: 20,
      content: '" " !important',
      backgroundImage: 'url(\'/images/mask.svg\')',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
      left: 'calc(34%)',
      bottom: 0,
      zIndex: -100,
      marginBottom: -10,
    },
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
    color: theme.palette.grey[50],
  },
  mark: {
    color: '#FFFFFF',
    top: '34px',
  },
  markLabel: {
    top: '12px',
    left: '108% !important',
    [theme.breakpoints.up('sm')]: {
      top: '6px',
      left: '113% !important',
    },
  },
}))(Slider);

interface IProps {
  [SITES_STORE_KEY]?: SitesListStore;
  [AUTH_STORE_KEY]?: AuthStore
}

const MonthlyPriceRange: React.FC<IProps> = ({ sitesStore, auth }) => {
  const [pricerangereached, setIsPriceRangeReached] = useState<boolean>(false);
  const classes = useStyles({ pricerangereached });
  const isAutoApplied = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const debouncedApply = useCallback(debounce(() => sitesStore.applyFilters(), 500), []);
  const {
    maxFilterPrice, currencySign, currency, name: currentCountry, minPriceDifference,
  } = useCurrentCountry();
  const marks = [
    {
      value: 0,
      label: currencySign,
    },
    {
      value: 100,
      label: currencySign,
    },
  ];
  const [prices, setPrices] = useState<[number, number]>([0, maxFilterPrice]);
  const priceStart = sitesStore.filters.price_start;
  const priceEnd = sitesStore.filters.price_end;

  const newPrices = (): [number, number] => [
    prices[0] >= maxFilterPrice ? priceStart || 0 : prices[0],
    prices[1] <= 0 ? priceEnd || maxFilterPrice : prices[1],
  ];

  useEffect(() => {
    setPrices([priceStart || 0, priceEnd || maxFilterPrice]);
  }, [priceStart, priceEnd]);

  const sendEvents = () => {
    const trackingPayload: ITrackingSearch = {
      customerEmail: auth?.user?.email,
      customerPhone: auth?.user?.phone_number,
      customerName: `${auth?.user?.first_name}${auth?.user?.last_name}`,
      userId: auth?.user?.id,
      currency,
      status: '',
      siteName: '',
      country: currentCountry,
      type: 'Price',
    };
    const eventName = IEventName.FILTERS_USED;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
  };

  const handleChange = (event, newValue) => {
    setIsPriceRangeReached(false);
    const start = newValue[0];
    const end = newValue[1];
    const minEnd = start + minPriceDifference;
    const maxStart = maxFilterPrice - minPriceDifference;

    if (start >= maxStart) {
      setIsPriceRangeReached(true);
      return;
    }

    if (minEnd >= end) {
      setIsPriceRangeReached(true);
      return;
    }

    setPrices([start, end]);
    if (isAutoApplied) {
      debouncedApply();
    }
  };

  const handleChangeCommit = () => {
    const vals = newPrices();
    sitesStore.setFilter('price_start', vals[0]);
    sitesStore.setFilter('price_end', vals[1]);
    sendEvents();
  };

  const { t } = usePageTranslation('search', 'MonthlyPriceRange');

  return (
    <Box>
      <Hidden only="xs">
        <Typography variant="h4" className={classes.title}>
          {t('typography1')}
        </Typography>
      </Hidden>
      <Box className={classes.root}>
        <Box>
          <Typography variant="h4">
            {t('typography2')}
          </Typography>
        </Box>
        <Box className={classes.sliderBox}>
          <CustomSlider
            marks={marks}
            value={newPrices()}
            onChange={handleChange}
            valueLabelFormat={formatterMoney}
            onChangeCommitted={handleChangeCommit}
            max={maxFilterPrice}
            min={0}
            valueLabelDisplay="on"
            aria-labelledby="range-slider"
            pricerangereached={pricerangereached || undefined}
          />
        </Box>
        <Box className={classes.sliderBottomText}>
          <Typography variant="h6">{t('typography3')}</Typography>
          <Typography variant="h6">{t('typography4')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default inject(SITES_STORE_KEY, AUTH_STORE_KEY)(observer(MonthlyPriceRange));
