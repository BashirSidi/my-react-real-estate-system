import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import {
  Box,
  Checkbox,
  Divider,
  List,
  MenuItem,
  Typography,
} from '@material-ui/core';
import PlacesAutocomplete, {
  getLatLng,
  geocodeByPlaceId,
} from 'react-places-autocomplete';
import { BOX_TO_BOX } from 'config';
import clsx from 'clsx';
import Grey3Typography from '../../../../../../../components/Typographies/Grey3Typography';
import { MainTextField } from '../../../../../../../components/Inputs/MainInput';
import {
  CustomSelect,
  IconComponent,
  SelectInput,
} from '../../../../../../../components/Inputs/MainSelect';
import {
  BookingStore,
  BOOKING_STORE,
  BOX_TO_BOX_ADDRESS_KEY,
} from '../../../../../stores/BookingStore';
import usePageTranslation from '../../../../../../../hooks/usePageTranslation';
import Grey2Typography from '../../../../../../../components/Typographies/Grey2Typography';
import {
  getLocalStorage,
} from '../../../../../../../utilities/localStorage';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px 30px 0 -30px',
    [theme.breakpoints.up('sm')]: {
      margin: '20px 55px 0 -30px',
    },
  },
  titleBox: {
    margin: '10px 0 6px',
    [theme.breakpoints.up('sm')]: {
      margin: '0 0 40px',
    },
  },
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.8rem',
    },
  },
  subtitleBox: {
    marginTop: '12px',
    marginBottom: '4px',
    [theme.breakpoints.up('sm')]: {
      marginTop: '25px',
      marginBottom: '17px',
    },
  },
  subtitleText: {
    fontWeight: 600,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.4rem',
    },
  },
  inputBox: {
    position: 'relative',
  },
  inputSelect: {
    fontWeight: 400,
    fontSize: '1.2rem',
    padding: '17px 26px 13px 12px',
    border: '0px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.6rem',
    },
  },
  textField: {
    marginBottom: '10px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      '& fieldset': {
        border: '0px',
      },
    },
  },
  suggestionContainer: {
    width: '100%',
    marginTop: -1,
    top: 55,
    overflow: 'scroll',
    position: 'absolute',
    zIndex: 99,
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: `1px solid ${theme.palette.grey[50]}`,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
  },
  input: {
    '& >input': {
      // TODO: Uncomment when we have map view
      // padding: '14px 0 16px 13px',
      padding: '14px 13px 16px 13px',
      fontSize: '1.2rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.6rem',
      },
    },
  },
  manPower: {
    paddingTop: '40px',
    marginTop: '47px',
    borderTop: '2px solid rgb(152 152 152 / 10%)',
  },
  manPowerHeader: {
    width: '100%',
    display: 'flex',
  },
  manPowerTitle: {
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'uppercase',
    flex: 1,
    alignSelf: 'center',
  },
  manPowerCB: {
    height: '25px',
    width: '25px',
    border: `1px solid ${theme.palette.grey[50]}`,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',

  },
  manPowerCBIcon: {
    backgroundColor: '#EA5B21',
    '&:before': {
      alignSelf: 'center',
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
        + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 "
        + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
  manPowerSubtitle: {
    fontSize: '16px',
    lineHeight: '25px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
      lineHeight: '20px',
    },
  },
  manPowerLabel: {
    fontWeight: 600,
    fontSize: '12px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
    },
  },
  manPowerHint: {
    padding: '15px 0 15px 0',
    maxWidth: '450px',
    transition: 'all 0.3s',
    marginBottom: '20px',
  },
  manPowerWarning: {
    color: '#ed6833',
  },
}));

interface IProps {
  bookingStore?: BookingStore;
  setManPower: (value: number) => void;
  manPower: number;
}

const YourCollectionDetail: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { bookingStore, setManPower, manPower } = props;
  const {
    pickUpDetails: { time },
    serviceSlots,
  } = bookingStore;
  const [addressText, setAddress] = useState(
    bookingStore.pickUpDetails?.address?.value || '',
  );
  const { t } = usePageTranslation('checkout', 'YourCollectionDetail');
  const isBoxToBox = bookingStore?.booking?.site_name === BOX_TO_BOX;
  const pickUpData = getLocalStorage(BOX_TO_BOX_ADDRESS_KEY);

  const handleSelectStreet = async (val, placeId) => {
    const location = await geocodeByPlaceId(placeId);
    const coords = await getLatLng(location[0]);

    setAddress(location[0]?.formatted_address);
    bookingStore.setPickupDetails('lat', coords.lat);
    bookingStore.setPickupDetails('lng', coords.lng);
    bookingStore.setPickupDetails('address', location[0]?.formatted_address);
    bookingStore.setPickupDetails('moverCount', isBoxToBox ? 1 : manPower);
  };

  useEffect(() => {
    if (isBoxToBox) {
      const data = pickUpData && JSON.parse(pickUpData);

      bookingStore.setPickupDetails('lat', data?.lat);
      bookingStore.setPickupDetails('lng', data?.lng);
      bookingStore.setPickupDetails('address', data?.address);
      bookingStore.setPickupDetails('moverCount', 1);
      setAddress(data?.address);
    } else {
      const address = bookingStore?.pickUpDetails?.address?.value;
      setAddress(address);
    }
  }, [bookingStore, isBoxToBox, pickUpData]);

  return (
    <Box className={classes.root}>
      <Box className={classes.titleBox}>
        <Grey3Typography className={classes.titleText} variant="h5">
          {t('grey3Typography1')}
        </Grey3Typography>
      </Box>
      <Box mb={1} className={classes.subtitleBox}>
        <Grey3Typography variant="caption" className={classes.subtitleText}>
          {t('grey3Typography2')}
        </Grey3Typography>
      </Box>
      <Box className={classes.inputBox}>
        <PlacesAutocomplete
          searchOptions={{
            // TODO: LOCALIZATION country-change -> Make it dynamic based off on country domain
            componentRestrictions: { country: 'sg' },
          }}
          value={addressText}
          onChange={(val) => setAddress(val)}
          onSelect={handleSelectStreet}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading: suggestionLoading,
          }) => (
            <>
              <MainTextField
                variant="outlined"
                placeholder={t('placeholder')}
                value={addressText}
                onChange={(e) => bookingStore.setPickupDetails('address', e.target.value)}
                fullWidth
                className={classes.textField}
                {...getInputProps({ placeholder: t('placeholder') })}
                InputProps={{
                  className: classes.input,
                }}
              />
              {(suggestionLoading || suggestions.length > 0) && (
                <List className={classes.suggestionContainer}>
                  {suggestionLoading && <MenuItem>{t('menuItem')}</MenuItem>}
                  {suggestions.map((suggestion, i) => {
                    const idx = i;
                    return (
                      <div
                        key={`${idx}-key`}
                        {...getSuggestionItemProps(suggestion)}
                      >
                        <MenuItem>{suggestion.description}</MenuItem>
                      </div>
                    );
                  })}
                </List>
              )}
            </>
          )}
        </PlacesAutocomplete>

        {bookingStore.pickUpDetails.address.err && (
          <Typography color="error">
            {bookingStore.pickUpDetails.address.err}
          </Typography>
        )}
      </Box>
      <Box className={classes.subtitleBox}>
        <Grey3Typography variant="caption" className={classes.subtitleText}>
          {t('grey3Typography3')}
        </Grey3Typography>
      </Box>
      <Box className={classes.inputBox}>
        <CustomSelect
          labelId="demo"
          fullWidth
          IconComponent={IconComponent}
          input={<SelectInput classes={{ input: classes.inputSelect }} />}
          value={time.value}
          onChange={(e: React.ChangeEvent<{ value: string }>) => bookingStore.setPickupDetails('time', e.target.value)}
        >
          {serviceSlots.map((item) => (
            <MenuItem key={item.time} value={item.time}>
              {item.label}
            </MenuItem>
          ))}
        </CustomSelect>
      </Box>
      {!isBoxToBox && (
        <Box className={classes.manPower}>
          <Box className={classes.manPowerHeader}>
            <Grey3Typography variant="caption" className={classes.manPowerTitle}>
              {t('grey3TypographyTitle')}
            </Grey3Typography>
            <Checkbox
              checkedIcon={<span className={clsx(classes.manPowerCB, classes.manPowerCBIcon)} />}
              icon={<span className={classes.manPowerCB} />}
              value={manPower === 1}
              onChange={() => {
                setManPower(manPower === 1 ? 0 : 1);
                bookingStore.setPickupDetails(
                  'moverCount',
                  manPower === 1 ? 0 : 1,
                );
              }}
            />
          </Box>
          <Grey2Typography
            className={manPower === 1
              ? classes.manPowerHint
              : clsx(classes.manPowerHint, classes.manPowerWarning)}
          >
            {manPower === 1 ? t('grey3TypographySubtitle') : t('grey3TypographyWarning')}
          </Grey2Typography>
        </Box>
      )}
      <Divider />
    </Box>
  );
};

export default inject(BOOKING_STORE)(observer(YourCollectionDetail));
