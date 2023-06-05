import React, { useState } from 'react';
import {
  Box,
  makeStyles,
  Typography,
  Grid,
  MenuItem,
  List,
  Theme,
  useMediaQuery,
} from '@material-ui/core';
import { setLocalStorage } from 'utilities/localStorage';
import PlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import clsx from 'clsx';
import Header from '../Header';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { MainTextField } from '../../../../components/Inputs/MainInput';
import SearchAddressMap from '../SearchAddressMap';
import HowItWork from './HowItWork';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#FFFFFF',
    paddingTop: '17px',
    [theme.breakpoints.up('md')]: {
      paddingTop: '24px',
    },
    overflow: 'hidden',
    border: 'none',
    paddingBottom: '100px',
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      padding: '0 0 0 32px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '5%',
    },
  },
  title: {
    margin: '35px 0',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
  },

  label: {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 600,
  },
  normalText: {
    fontSize: '16px',
    fontWeight: 400,
  },
  redTitle: {
    color: 'red',
  },
  inputNumber: {
    margin: '20px 0',
  },
  cssOutlinedInput: {
    border: '1px solid #D8D9D8',
    boxSizing: 'border-box',
    fontSize: '16px',
    textAlign: 'center',
    color: '#333333',
    borderRadius: '12px',
  },
  textAlign: {
    textAlign: 'center',
  },
  icon: {
    padding: '10px',
  },
  stepTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },
  stepContent: {
    fontSize: '12px',
    fontWeight: 400,
  },
  boxContainer: {
    margin: '10px 0',
  },
  header: {
    fontSize: '22px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
    },
    fontWeight: 600,
    borderTop: 'solid 1px',
    borderColor: '#e9e9e9',
    marginTop: '40px',
    paddingTop: '35px',
    marginBottom: '20px',
  },
  textField: {
    margin: '10px 0',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      '& fieldset': {
        border: '0px',
      },
    },
  },
  input: {
    '& >input': {
      // TODO: Uncomment when we have map view
      // padding: '14px 0 16px 13px',
      padding: '14px 13px 16px 13px',
      fontSize: '1.6rem',
    },
  },
  suggestionContainer: {
    width: '100%',
    maxWidth: '350px',
    marginTop: '2px',
    top: 380,
    '@media (width: 428px)': {
      maxWidth: '380px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '650px',
      marginTop: 25,
    },
    overflow: 'scroll',
    position: 'absolute',
    zIndex: 99,
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: `1px solid ${theme.palette.grey[50]}`,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
  },
  suggestItem: {
    padding: '13px 10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '118px 1fr',
    gridGap: '22px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '135px 80px',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '287px 1fr',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: '360px 1fr',
    },
  },
}));

interface IProps {
  address: string;
  setAddress: (val: string) => void;
}

const ChooseAddress: React.FC<IProps> = ({ setAddress, address }) => {
  // Constants
  const classes = useStyles();
  const { t } = usePageTranslation('darkStorage', 'ChooseAddress');

  // Functions
  const handleSelectStreet = async (val, placeId) => {
    const location = await geocodeByPlaceId(placeId);
    const latLong = await getLatLng(location?.[0]);
    setLocalStorage(
      'boxToBoxPickUpAddress',
      JSON.stringify({
        lat: latLong.lat,
        lng: latLong.lng,
        address: location[0]?.formatted_address,
      }),
    );
    setAddress(location[0]?.formatted_address);
  };

  return (
    <Box className={classes.root}>
      <Header content="ChooseAddress" />
      <Grid className={classes.container}>
        <Grid container>
          <Typography className={classes.title}>
            {t('deliveryTitle')}
          </Typography>
        </Grid>
        <Grid>
          <Grid container>
            <Typography className={classes.label}>
              {t('addressLabel')}
            </Typography>
            <Typography className={classes.redTitle}>
              *
            </Typography>
          </Grid>
          <Grid container sm={12} md={6}>
            <PlacesAutocomplete
              searchOptions={{
                // TODO: LOCALIZATION country-change -> Make it dynamic based off on country domain
                componentRestrictions: { country: 'sg' },
              }}
              value={address}
              onChange={(val) => {
                setAddress(val);
              }}
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
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    fullWidth
                    className={classes.textField}
                    {...getInputProps({ placeholder: t('placeholder') })}
                    InputProps={{
                      className: classes.input,
                    }}
                  />
                  {(suggestionLoading || suggestions.length > 0) && (
                    <List className={classes.suggestionContainer}>
                      {suggestionLoading && (
                        <MenuItem>{t('menuItem')}</MenuItem>
                      )}
                      {suggestions.map((suggestion, i) => {
                        const idx = i;
                        return (
                          <div
                            key={`${idx}-key`}
                            {...getSuggestionItemProps(suggestion)}
                          >
                            <MenuItem
                              className={classes.suggestItem}
                            >
                              {suggestion.description}
                            </MenuItem>
                          </div>
                        );
                      })}
                    </List>
                  )}
                </>
              )}
            </PlacesAutocomplete>
          </Grid>
        </Grid>
        <Grid>
          <Typography className={clsx(classes.header)}>
            {t('howItWorksTitle')}
          </Typography>
          <Typography className={classes.normalText}>
            {t('howItWorksContent')}
          </Typography>
          <HowItWork />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChooseAddress;
