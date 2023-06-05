import React, { FC } from 'react';
import {
  makeStyles,
  Typography,
  Box,
  fade,
  useMediaQuery,
  Theme,
} from '@material-ui/core';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPolicy } from 'utilities/progress.link';
import Image from '../../../../../components/Image';
import {
  BookingStatus,
  FixedCountry,
  OrderStatus,
} from '../../../../../typings/graphql.types';
import { GetBookingQuery_booking } from '../../../queries/__generated__/GetBookingQuery';
import usePageTranslation from '../../../../../hooks/usePageTranslation';
import PaymentSchedule from '../../PaymentSchedule';
import { GET_SPACE_BY_ID } from '../../../queries';
import { GetSpaceQuery, GetSpaceQueryVariables } from '../../../queries/__generated__/GetSpaceQuery';
import { useCurrentCountry, getTranslatedName } from '../../../../../utilities/market';

interface IProps {
  booking: GetBookingQuery_booking;
}

const useStyles = makeStyles((theme) => ({
  paymentSummary: {
    [theme.breakpoints.up('sm')]: {
      padding: '50px 45px 20px',
      borderRadius: '22px',
      border: `1px solid ${theme.palette.grey[50]}`,
      height: 'fit-content',
    },
  },
  block: {
    padding: '20px 0',
    borderTop: `2px solid ${fade(theme.palette.grey[100], 0.1)}`,
    [theme.breakpoints.up('sm')]: {
      '&:first-of-type': {
        borderTop: 'none',
      },
    },
  },
  blockElement: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
      '&:not(:last-of-type)': {
        marginBottom: '10px',
      },
    },
  },
  visa: {
    width: '50px',
    height: '32px',
    borderRadius: '4px',
    boxShadow: '0 15px 40px rgba(51, 51, 51, 0.1)',
  },
  checkMark: {
    width: 12,
    marginRight: 5,
  },
  promo: {
    display: 'flex',
  },
  center: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: 600,
  },
  font18: {
    fontSize: 18,
  },
  invoice: {
    marginLeft: 17,
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
  pointer: {
    cursor: 'pointer',
  },
  green: {
    color: theme.palette.success.main,
  },
  red: {
    color: theme.palette.error.main,
  },
  grey: {
    color: theme.palette.grey[100],
  },
  black: {
    color: '#000000',
  },
  rootBox: {
    marginTop: '1rem',
  },
  rootLink: {
    display: 'inline-block',
    color: theme.palette.primary.main,
  },
  link: {
    fontSize: '1.15rem',
  },
  image: {
    margin: '0.2rem',
    marginRight: '1rem',
  },
  storage: {
    margin: '0.65rem',
    marginRight: '1.45rem',
  },
  terminate: {
    margin: '0.65rem',
    marginLeft: '0.7rem',
    marginRight: '1.45rem',
  },
  textInvoice: {
    marginLeft: '0.2rem',
  },
}));

const financial = (x) => Number.parseFloat(x).toFixed(2);

const PaymentSummary: FC<IProps> = ({ booking }) => {
  const classes = useStyles();
  const { locale } = useRouter();
  /* eslint-disable @typescript-eslint/naming-convention */
  const {
    status,
    deposited_amount,
    is_insured,
    discount_amount,
    currency_sign,
    transactions,
    renewals,
    orders,
    payment_schedule,
    original_space,
    total_tax_amount,
    applied_taxes,
  } = booking || {};
  const pickup = (orders || []).find((order) => {
    if (
      order.status === OrderStatus.CONFIRMED
      && !!order.order_pick_up_service
    ) {
      return true;
    }
    return false;
  });

  const transaction = transactions ? transactions[0] : null;
  const renewal = renewals ? renewals[0] : null;
  const { t } = usePageTranslation('checkout', 'PaymentSummary');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  const countryName = useCurrentCountry().name;
  const { data } = useQuery<GetSpaceQuery, GetSpaceQueryVariables>(
    GET_SPACE_BY_ID, {
      variables: {
        id: original_space?.id,
        country: countryName,
        isQIdSet: false,
      },
    },
  );
  const { name } = useCurrentCountry();

  let taxTitle = '';
  const taxes = applied_taxes || [];
  if (taxes.length) {
    taxTitle = `${getTranslatedName(taxes[0]?.tax, 'name', locale)}(${taxes[0].value}%)`;
  }

  const totalTaxAmount = total_tax_amount + (pickup?.order_pick_up_service?.tax_amount || 0);
  return (
    <Box className={classes.paymentSummary}>
      {booking && (
        <Box>
          <Box className={classes.blockElement}>
            <Typography className={`${classes.bold} ${classes.font18}`}>
              {t('typography1')}
            </Typography>
            <Typography className={classes.green}>
              <Image
                className={classes.checkMark}
                folder="BookingConfirmed"
                name="checkmar"
              />
              {status === BookingStatus.CONFIRMED ? t('bookingStatus') : status}
            </Typography>
          </Box>
          <Box mt={8} className={classes.blockElement}>
            <Typography className={classes.grey}>{t('typography2')}</Typography>
            <Typography className={classes.black}>
              {currency_sign}
              {financial(renewal?.sub_total_amount)}
            </Typography>
          </Box>
          {!!discount_amount && discount_amount > 0 && (
            <Box mt={7} className={classes.blockElement}>
              <Box className={classes.promo}>
                <Typography className={classes.grey}>
                  {t('typography3')}
                </Typography>
              </Box>
              <Typography className={classes.red}>
                -
                {currency_sign}
                {financial(discount_amount)}
              </Typography>
            </Box>
          )}
          <Box mt={7} className={classes.blockElement}>
            <Typography className={classes.grey}>{t('typography4')}</Typography>
            <Typography>
              {currency_sign}
              {financial(deposited_amount)}
            </Typography>
          </Box>
          {!!pickup && (
            <Box mt={7} className={classes.blockElement}>
              <Typography className={classes.grey}>
                {t('typography5')}
              </Typography>
              <Typography>
                {currency_sign}
                {financial(pickup.total_amount - pickup.order_pick_up_service?.tax_amount)}
              </Typography>
            </Box>
          )}
          {is_insured && (
            <Box mt={7} className={classes.blockElement}>
              <Typography className={classes.grey}>
                {t('typography6')}
              </Typography>
              <Typography>
                {currency_sign}
                {financial(renewal?.insurance_amount)}
              </Typography>
            </Box>
          )}
          {(totalTaxAmount > 0) && (
            <Box>
              <Box mt={7} className={classes.blockElement}>
                <Typography className={classes.grey}>
                  {taxTitle}
                </Typography>
                <Typography>
                  {currency_sign}
                  {financial(totalTaxAmount)}
                </Typography>
              </Box>
              <Box mt={7} className={classes.blockElement}>
                <Typography className={`${classes.bold} ${classes.font18}`}>
                  {t('typography7')}
                </Typography>
                <Typography className={`${classes.bold} ${classes.font18}`}>
                  {currency_sign}
                  {financial(transaction?.amount || renewal?.total_amount)}
                </Typography>
              </Box>
              <Box mt={2} mb={10} className={classes.blockElement}>
                <Typography variant="body2" className={classes.grey}>
                  {t('typography8')}
                </Typography>
                {payment_schedule?.length > 0 && (
                  <Box>
                    <PaymentSchedule
                      hideEmbed={isMobile}
                      paymentSchedule={payment_schedule}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Box className={classes.block}>
        <Box className={classes.blockElement}>
          <Typography className={classes.bold}>{t('typography9')}</Typography>
        </Box>
        <Box mt={11} className={classes.blockElement}>
          <Image
            name={transaction?.card_brand_name?.toLowerCase().replace(' ', '-')}
            className={classes.visa}
            folder="Payments"
          />
          <Typography>
            **** **** ****
            {' '}
            {transaction?.card_last_digits}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.block}>
        {transaction && (
          <Box className={classes.rootBox}>
            <Box
              className={`${classes.promo} ${classes.center} ${classes.pointer}`}
            >
              <Image className={classes.image} folder="BookingConfirmed" name="invoice" />
              <Link href={{ pathname: `/customer/invoice/${transaction.id}`, query: { agreement_id: data?.spaces?.edges?.[0]?.site?.agreement?.id, site_id: data?.spaces?.edges?.[0]?.site?.id } }} prefetch={false}>
                <a className={classes.rootLink} target="_blank" rel="noreferrer">
                  <Typography className={`${classes.link} ${classes.textInvoice}`}>
                    {countryName === 'Singapore' ? t('typography10SG') : t('typography10')}
                  </Typography>
                </a>
              </Link>
            </Box>
            {name !== FixedCountry.Japan && (
              <Box
                className={`${classes.promo} ${classes.center} ${classes.pointer}`}
              >
                <Image className={`${classes.storage} ${classes.image}`} folder="BookingConfirmed" name="self_storage_policy" />
                <Link href={{ pathname: '/self-agreement', query: { agreement_id: data?.spaces?.edges?.[0]?.site?.agreement?.id, site_id: data?.spaces?.edges?.[0]?.site?.id } }} passHref>
                  <a className={classes.rootLink} target="_blank" rel="noreferrer">
                    <Typography className={classes.link}>
                      {t('link1')}
                    </Typography>
                  </a>
                </Link>
              </Box>
            )}
            {getPolicy(t, name, 0)?.map((link, index) => (
              <Box
                key={index}
                className={`${classes.promo} ${classes.center} ${classes.pointer}`}
              >
                <Image className={`${classes.terminate} ${classes.image}`} folder="BookingConfirmed" name="termination_policy" />
                <a className={classes.rootLink} href={link.address} rel="noreferrer" target="_blank">
                  <Typography className={classes.link}>
                    {link.title}
                  </Typography>
                </a>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentSummary;
