import React from 'react';
import { Box, fade, makeStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { BOX_TO_BOX } from 'config';
import clsx from 'clsx';
import { BookingStore, BOOKING_STORE } from '../../../stores/BookingStore';
import { getResizedURL } from '../../../../../utilities/imageResizer';
import { getTranslatedName } from '../../../../../utilities/market';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '118px',
    width: '118px',
    overflow: 'hidden',
    borderRadius: '16px',
    backgroundColor: fade(theme.palette.grey[50], 0.8),

    '& img': {
      minWidth: '100%',
      minHeight: '100%',
      height: 'inherit',
      width: 'inherit',
      maxHeight: 'inherit',
      maxWidth: 'inherit',
      objectFit: 'cover',
    },
  },

  boxToBox: {
    height: 'inherit',
  },
}));

interface IProps {
  [BOOKING_STORE]?: BookingStore;
}

const StorageImage: React.FC<IProps> = ({ bookingStore }) => {
  const classes = useStyles();
  const { locale } = useRouter();
  const isBoxToBox = bookingStore.space?.site?.name === BOX_TO_BOX;
  const img = isBoxToBox ? bookingStore.space?.images?.[0] : bookingStore.space?.site?.images?.[0];

  return (
    <Box className={clsx(classes.wrapper, isBoxToBox && classes.boxToBox)}>
      {img && (
        <img
          src={getResizedURL(img, { width: 200 })}
          alt={getTranslatedName(bookingStore?.space?.site, 'name', locale)}
        />
      )}
    </Box>
  );
};

export default inject(BOOKING_STORE)(observer(StorageImage));
