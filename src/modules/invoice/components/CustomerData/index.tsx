import React from 'react';
import { format } from 'date-fns';
import {
  Box, Grid, makeStyles, Typography,
} from '@material-ui/core';
import { useCurrentCountry } from 'utilities/market';
import usePageTranslation from '../../../../hooks/usePageTranslation';

const useStyles = makeStyles((theme) => ({
  mobileColumn: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dark: {
    color: '#5e5873',
    fontWeight: 'bold',
  },
  detailsWidth: {
    width: 330,
  },
}));

interface IProps {
  customer: {
    name: string
    phone_number: string
    email: string
    card_brand_name: string
    card_last_digits: string
  }
  transaction_short_id: string
  start_date: string
  end_date: string
  booking_short_id: string
  invoice_id: string
  transaction_id?: number;
}

const CustomerData: React.FC<IProps> = ({
  customer,
  transaction_short_id,
  start_date, end_date,
  booking_short_id,
  transaction_id,
}) => {
  const classes = useStyles();
  const currentCountry = useCurrentCountry().name;
  const { t } = usePageTranslation('customerInvoice', 'CustomerData');

  // TODO: this is temp solution until we have different address for different invoices
  // Did that on request of CS
  // https://space-next-door.atlassian.net/browse/SND-1180
  const getTempInvocieByBooking = (transactionId: number) => {
    if (transactionId < 5888) {
      return (
        <>
          <Typography className={classes.dark}>Jonas N. (lonaka) Sorensen</Typography>
          <Typography>+85296856269</Typography>
          <Typography>jsorensen@mauijim.com</Typography>
        </>
      );
    }
    return (
      <>
        <Typography className={classes.dark}>Fairus Kesuma </Typography>
        <Typography>+6581320993</Typography>
        <Typography>Fkesuma@mauijim.com</Typography>
      </>
    );
  };
  return (
    <Grid className={`${classes.spaceBetween} ${classes.mobileColumn}`} item>
      <Box mt={6}>
        <Typography className={classes.dark}>
          {currentCountry === 'Singapore' ? t('typography1SG') : t('typography1')}
          :
        </Typography>
        <br />
        {(() => {
          if (booking_short_id === '700474') {
            return getTempInvocieByBooking(transaction_id);
          }
          return (
            <>
              <Typography className={classes.dark}>{customer?.name}</Typography>
              <Typography>{customer?.phone_number}</Typography>
              <Typography>{customer?.email}</Typography>
            </>
          );
        })()}
      </Box>
      <Box className={classes.detailsWidth} mt={6}>
        <Typography className={classes.dark}>
          {t('typography2')}
          :
        </Typography>
        <br />
        <Typography className={classes.spaceBetween}>
          <span>
            {t('typography3')}
            :
          </span>
          <span>{transaction_short_id}</span>
        </Typography>
        <Typography className={classes.spaceBetween}>
          <span>
            {t('typography4')}
            :
          </span>
          <span>{customer?.card_brand_name}</span>
        </Typography>
        <Typography className={classes.spaceBetween}>
          <span>
            {t('typography5')}
            :
          </span>
          <span>
            XXXXXXXX
            {customer?.card_last_digits}
          </span>
        </Typography>
        <Typography className={classes.spaceBetween}>
          <span>
            {t('typography6')}
          </span>
          <span>
            {start_date && format(new Date(start_date), 'dd MMM yyyy')}
          </span>
        </Typography>
        <Typography className={classes.spaceBetween}>
          <span>
            {t('typography7')}
          </span>
          <span>
            {end_date && format(new Date(end_date), 'dd MMM yyyy')}
          </span>
        </Typography>
      </Box>
    </Grid>
  );
};

export default CustomerData;
