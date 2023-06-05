import {
  InputAdornment, Box, List, MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlacesAutocomplete, {
  getLatLng,
  geocodeByPlaceId,
} from 'react-places-autocomplete';
import React, { useState } from 'react';
import { setLocalStorage } from 'utilities/localStorage';
import { MainTextField } from '../../../../components/Inputs/MainInput';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { BOX_TO_BOX_ADDRESS_KEY } from '../../../checkout/stores/BookingStore';
import { getLocalStorage } from '../../../../utilities/localStorage';

const useStyles = makeStyles((theme) => ({
  inputBox: {
    position: 'relative',
  },
  textField: {
    border: '0px',
    '& .MuiOutlinedInput-root': {
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      '& fieldset': {
        border: '0px',
      },
    },
  },
  input: {
    '& >input': {
      padding: '14px 0 16px 13px',
      fontSize: '1.2rem',
      color: theme.palette.grey[200],
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.6rem',
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
}));

interface IProps {
  setAddress: (address: string) => void;
}

const InputCurrentLocation: React.FC<IProps> = ({ setAddress }) => {
  const classes = useStyles();
  const [location, setLocation] = useState('');
  const { t } = usePageTranslation('checkout', 'InputCurrentLocation');

  const handleSelectStreet = async (_: string, placeId: string) => {
    const address = await geocodeByPlaceId(placeId);
    const coords = await getLatLng(address[0]);
    const pickUpData = getLocalStorage(BOX_TO_BOX_ADDRESS_KEY);

    setLocalStorage(
      BOX_TO_BOX_ADDRESS_KEY,
      JSON.stringify({
        ...JSON.parse(pickUpData),
        ...coords,
        address,
      }),
    );
    setLocation(address[0]?.formatted_address);
    setAddress(address[0]?.formatted_address);
  };

  return (
    <Box className={classes.inputBox}>
      <PlacesAutocomplete
        searchOptions={{
          // TODO: LOCALIZATION country-change -> Make it dynamic based off on country domain
          componentRestrictions: { country: 'sg' },
        }}
        value={location}
        onChange={(val) => setLocation(val)}
        onSelect={handleSelectStreet}
      >
        {({
          getInputProps, suggestions, getSuggestionItemProps, loading: suggestionLoading,
        }) => (
          <>
            <MainTextField
              placeholder={t('placeholder')}
              variant="outlined"
              fullWidth
              className={classes.textField}
              {...getInputProps({ placeholder: t('placeholder') })}
              InputProps={{
                className: classes.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <Image name="searchIcon" folder="Homepage" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="start"
                  >
                    <Image name="location" folder="CheckoutPage" />
                  </InputAdornment>
                ),
              }}
            />
            {(suggestionLoading || suggestions.length > 0) && (
              <List className={classes.suggestionContainer}>
                {suggestionLoading && <MenuItem>{t('menuItem')}</MenuItem>}
                {suggestions.map((suggestion, i) => {
                  const idx = i;
                  return (
                    <div key={`${idx}-key`} {...getSuggestionItemProps(suggestion)}>
                      <MenuItem>{suggestion.description}</MenuItem>
                    </div>
                  );
                })}
              </List>
            )}
          </>
        )}
      </PlacesAutocomplete>
    </Box>
  );
};

export default InputCurrentLocation;
