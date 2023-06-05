import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import {
  Box,
  fade,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { BOX_TO_BOX, DOOR_TO_DOOR_PRICE, GOGOX_RECOMMENDATION } from 'config';
import StyledRadio from '../../../../RadioButton';
import Grey3Typography from '../../../../../../../../components/Typographies/Grey3Typography';
import PrimaryTypography from '../../../../../../../../components/Typographies/PrimaryTypography';
import Image from '../../../../../../../../components/Image';
import usePageTranslation from '../../../../../../../../hooks/usePageTranslation';
import { BookingStore } from '../../../../../../stores/BookingStore';
import SearchAddressMap from '../../YourCollectionDetail/SearchAddressMap';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '350px',
    maxHeight: '350px',
    minWidth: '159px',
    maxWidth: '179px',
    [theme.breakpoints.up('sm')]: {
      minWidth: '234px',
      maxWidth: '234px',
      minHeight: '420px',
      maxHeight: '420px',
    },
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    position: 'relative',
    marginBottom: '40px',
  },
  checked: {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: '0px 15px 40px rgba(51, 51, 51, 0.1)',
  },
  noChecked: {
    border: `2px solid ${theme.palette.grey[50]}`,
  },
  image: {
    display: 'flex',
    padding: '8px 0 3px',
    height: '50px',
    marginBottom: '0',
    '& img': {
      height: 'auto',
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: '0',
      padding: '13px 0',
      height: 'auto',
      '& img': {
        height: '65px',
      },
    },
    justifyContent: 'center',
  },
  radio: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'left',
    padding: '0 10px',
  },
  recommendImg: {
    position: 'relative',
    right: '18px',
  },
  secondHeader: {
    padding: '0 10px',
    fontSize: '12px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
    },
  },
  listItem: {
    padding: '0 10px',
    '& span': {
      fontSize: '1.1rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '14px',
      },
    },
  },
  itemIcon: {
    minWidth: '23px',
  },
  dividerMiddle: {
    marginBottom: '4px',
    margin: '0 10px',
    height: '2px',
    [theme.breakpoints.up('sm')]: {
      margin: '7px 10px',
    },
  },
  middle: {
    margin: '0 10px',
    height: '2px',
    [theme.breakpoints.up('sm')]: {
      margin: '7px 10px',
    },
  },
  headerText: {
    fontWeight: 600,
    textAlign: 'left',
    fontSize: '12px',
    marginBottom: '0',
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
      padding: '0',
      lineHeight: '20px',
    },
  },
  descriptionText: {
    textAlign: 'left',
    color: theme.palette.grey[100],
    fontSize: '10px',
    lineHeight: '15px',
    [theme.breakpoints.up('sm')]: {
      margin: '0',
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  fromSize: {
    fontSize: '10px',
    lineHeight: '15px',
    marginBottom: '6px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
      marginBottom: '6px',
      lineHeight: '20px',
    },
  },
  costText: {
    marginTop: '0',
    fontSize: '18px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '22px',
      marginTop: '7px',
    },
  },
  costBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: '1rem',
    margin: '0 20px',
    paddingTop: ' 9px',
    // borderTop: '2px solid #E9E9E9',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '4px',
    },
  },
  startingText: {
    lineHeight: '1rem',
    fontWeight: 400,
    marginLeft: '20px',
  },
  viewStorage: {
    textAlign: 'center',
    fontSize: '12px',
    marginTop: '18px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
      marginTop: '20px',
    },
  },
  mostPopular: {
    position: 'absolute',
    left: '23px',
    top: '15px',
    color: theme.palette.primary.main,
    fontSize: '10px',
    lineHeight: '18px',
    fontWeight: 700,
    padding: '2px 20px',
    textTransform: 'uppercase',
    borderRadius: '10px',
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '9px',
      padding: '0 8px',
      left: '9px',
      top: '18px',
    },
  },
  hide: {
    display: 'none',
  },
  vehicleTitle: {
    fontSize: '12px',
    lineHeight: '15px',
    color: '#EA5B21',
    textAlign: 'center',
    margin: '3px 0 0 0',
    [theme.breakpoints.up('sm')]: {
      margin: '6px 0 5px 0',
    },
  },
  mb: {
    marginBottom: '12px',
    [theme.breakpoints.up('sm')]: {
      marginBottom: '40px',
    },
  },
}));

interface IProps {
  value: boolean;
  options: any;
  handleChange: (e) => void;
  bookingStore?: BookingStore;
  spaceSize?: string;
  manPower?:number;
  currency?: string;
}

function getRecommendedVehicle(spaceType) {
  return Object.keys(GOGOX_RECOMMENDATION)
    .find((key) => GOGOX_RECOMMENDATION[key].includes(spaceType));
}

const Service: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const {
    value,
    handleChange,
    bookingStore,
    manPower,
    options,
    currency,
    spaceSize,
  } = props;
  const { t } = usePageTranslation('checkout', 'Service');
  const [addressText, setAddress] = useState(bookingStore?.pickUpDetails?.address?.value || '');
  const [isOpen, setIsOpen] = useState(false);
  const isBoxToBox = bookingStore?.booking?.site_name === BOX_TO_BOX;
  const recommendedVehicle = getRecommendedVehicle(spaceSize);
  const handleSelectStreet = async (val, placeId) => {
    const location = await geocodeByPlaceId(placeId);
    const coords = await getLatLng(location[0]);

    setAddress(location[0]?.formatted_address);
    bookingStore.setPickupDetails('lat', coords.lat);
    bookingStore.setPickupDetails('lng', coords.lng);
    bookingStore.setPickupDetails('address', location[0]?.formatted_address);
  };

  useEffect(() => {
    setAddress(bookingStore?.pickUpDetails?.address?.value);
  }, [bookingStore?.pickUpDetails?.address?.value]);

  return (
    <Box
      className={clsx(value ? classes.checked : classes.noChecked, classes.root)}
      onClick={handleChange}
    >
      <Box className={classes.radio}>
        {options.fixed_price && options.vehicle_code === recommendedVehicle && <Image name="recommend" folder="CheckoutPage" extension="svg" className={classes.recommendImg} /> }
        <StyledRadio checked={value} />
      </Box>
      <SearchAddressMap isOpen={isOpen} setIsOpen={setIsOpen} />
      <Box className={classes.image}>
        {!options.fixed_price ? (
          <Image name="map_marker" folder="CheckoutPage" extension="svg" />
        ) : (
          <img src={options.icon} alt="" />
        )}
      </Box>
      <Box className={classes.header}>
        <Box mt={3}>
          <Grey3Typography
            variant="body2"
            className={options.vehicle_title
              ? classes.headerText
              : clsx(classes.headerText, classes.mb)}
          >
            {options.title_en}
            <span className={classes.vehicleTitle}>
              {' '}
              {options.vehicle_title}
            </span>
          </Grey3Typography>
          <Grey3Typography variant="body2" className={classes.descriptionText}>
            {options.description_en
              .slice(13)
              .replace(/(?<L>\d+(\.\d+)?m) x (?<W>\d+(\.\d+)?m) x (?<H>\d+(\.\d+)?m)/, 'L$<L> x W$<W> x H$<H>')}
          </Grey3Typography>
          {options.max_weight && (
            <Grey3Typography variant="body2" className={classes.descriptionText}>
              {`Max Weight: < ${options.max_weight} ${options.weight_unit}`}
            </Grey3Typography>
          )}
          {!isBoxToBox && options.size_from && (
            <Grey3Typography
              variant="body2"
              className={classes.fromSize}
            >
              From size
              {' '}
              {options.size_from}
            </Grey3Typography>
          )}
        </Box>
      </Box>
      {options.fixed_price && (
        <>
          <Divider variant="middle" className={classes.dividerMiddle} />
          <Box>
            <Typography className={classes.secondHeader}>
              What’s included?
            </Typography>
            <List disablePadding>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.itemIcon}>
                  <Image name="circle-check" folder="CheckoutPage" extension="svg" />
                </ListItemIcon>
                <ListItemText
                  primary="Driver"
                />
              </ListItem>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.itemIcon}>
                  <Image name="circle-check" folder="CheckoutPage" extension="svg" />
                </ListItemIcon>
                <ListItemText
                  primary="Loading & unloading"
                />
              </ListItem>
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.itemIcon}>
                  <Image name={isBoxToBox || manPower === 1 ? 'circle-check' : 'circle-oval'} folder="CheckoutPage" extension="svg" />
                </ListItemIcon>
                <ListItemText
                  primary="Door to Door service"
                />
              </ListItem>
            </List>
          </Box>
          <Divider variant="middle" className={classes.middle} />
        </>
      )}
      {!options.fixed_price && (
      <Box role="button" tabIndex={0} onClick={() => {}}>
        <PlacesAutocomplete
          searchOptions={{ componentRestrictions: { country: 'sg' } }}
          value={addressText}
          onChange={(val) => setAddress(val)}
          onSelect={handleSelectStreet}
        >
          {() => (
            <>
              <PrimaryTypography
                variant="body2"
                className={classes.viewStorage}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                {t('typography3')}
              </PrimaryTypography>
            </>
          )}
        </PlacesAutocomplete>
      </Box>
      )}
      {options.fixed_price && (
      <Box mt={2} className={classes.costBox}>
        <>
          <Typography variant="body2" className={classes.startingText}>
            {t('typography2')}
          </Typography>
          <Typography variant="h2" className={classes.costText}>
            {currency}
            {options.fixed_price + (isBoxToBox || manPower === 1 ? DOOR_TO_DOOR_PRICE : 0)}
          </Typography>
        </>
      </Box>
      )}
    </Box>
  );
};

export default Service;
