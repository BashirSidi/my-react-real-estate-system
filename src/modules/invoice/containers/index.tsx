import React from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import {
  Box, Grid, Divider, makeStyles, Typography,
} from '@material-ui/core';
import ClevertapReact from 'clevertap-react';
import { useCurrentCountry } from 'utilities/market';
import useTranslation from 'next-translate/useTranslation';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import { inject, observer } from 'mobx-react';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import { getPolicy } from 'utilities/progress.link';
import Link from 'next/link';
import { FixedCountry } from 'typings/graphql.types';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { ordinalSuffix } from 'utilities/ordinalSuffix';
import { FETCH_INVOICE_QUERY } from '../queries';
import usePageTranslation from '../../../hooks/usePageTranslation';
import InvoiceHead from '../components/InvoiceHead';
import Table from '../components/Table';
import Amount from '../components/Amount';
import CustomerData from '../components/CustomerData';
import { GetCustomerInvoiceQuery, GetCustomerInvoiceQueryVariables } from '../queries/__generated__/GetCustomerInvoiceQuery';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '40px 20px',
    backgroundColor: '#fff',
    color: '#6e6b7b',
    padding: 40,
    boxShadow: '0 4px 24px 0 rgb(34 41 47 / 30%)',
    borderRadius: 10,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: 20,
      margin: '20px 10px',
    },
  },
  divider: {
    width: '100%',
    backgroundColor: '#ebe9f1',
  },
  rootLink: {
    color: theme.palette.primary.main,
  },
  link: {
    fontSize: '1.2rem',
  },
}));

interface IProps {
  [AUTH_STORE_KEY]?: AuthStore;
}

const Invoice: React.FC<IProps> = ({ auth }) => {
  const classes = useStyles();
  const { lang } = useTranslation();
  const router = useRouter();
  const { locale } = useRouter();
  const id = parseInt(router?.query?.id as string, 10);
  const agreementId = parseInt(router?.query?.agreement_id as string, 10);
  const siteId = parseInt(router?.query?.site_id as string, 10);
  const currentCountry = useCurrentCountry().name;
  const { t } = usePageTranslation('customerInvoice', 'InvoiceFooter');
  const {
    loading, data, error,
  } = useQuery<GetCustomerInvoiceQuery, GetCustomerInvoiceQueryVariables>(
    FETCH_INVOICE_QUERY,
    {
      variables: {
        transaction_id: id,
      },
    },
  );
  const addCyclePeriod = (number) => {
    if (locale === 'en-US') {
      return ordinalSuffix(number);
    }
    return number;
  };

  const triggerViewedInvoiceEvent = () => {
    try {
      const { customer_invoice: invoice } = data;
      const item = [...invoice?.items].sort((a, b) => a.amount - b.amount).pop();
      const eventName = IEventName.INVOICE_VIEWED;
      const trackingPayload = {
        bookingAmount: invoice?.total_amount || 0,
        country: currentCountry,
        customerPhone: invoice?.customer?.phone_number || '',
        spaceSize: null,
        language: lang,
        platform: 'WEB',
        bookingId: id || 0,
        siteName: item?.name || null,
        invoiceTotalAmount: invoice?.total_amount || 0,
        spaceFeatures: null,
        customerEmail: invoice?.customer?.email,
        invoiceId: id,
        moveInDate: invoice?.start_date,
        customerName: invoice?.customer?.name,
        moveOutDate: invoice?.end_date,
        userId: auth?.user?.id,
      };
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.INVOICE_VIEWED, errEvent);
    }
  };
  React.useEffect(() => {
    if (data && !error) triggerViewedInvoiceEvent();
    // eslint-disable-next-line
  }, [data,error]);

  if (error) router.push('/404');
  return (
    <Grid className={classes.container}>
      {!loading && (
        <InvoiceHead
          id={id}
          booking_short_id={data?.customer_invoice?.booking_short_id}
          issue_date={data?.customer_invoice?.issue_date}
          due_date={data?.customer_invoice?.end_date}
          items={data?.customer_invoice?.items}
        />
      )}
      <Box mt={10} mb={10}>
        <Divider className={classes.divider} />
      </Box>
      {!loading && (
        <CustomerData
          transaction_short_id={`${data?.customer_invoice?.transaction_short_id}-${data?.customer_invoice?.cycle_period} ${t('cyclePeriod', { cycle: addCyclePeriod(data?.customer_invoice?.cycle_period) })}`}
          start_date={data?.customer_invoice?.start_date}
          end_date={data?.customer_invoice?.end_date}
          customer={data?.customer_invoice?.customer}
          booking_short_id={data?.customer_invoice?.booking_short_id}
          invoice_id={data?.customer_invoice?.invoice_id}
          transaction_id={id}
        />
      )}
      <Box mt={30} />
      {!loading && <Table items={data?.customer_invoice?.items} />}
      {!loading && <Amount customer_invoice={data?.customer_invoice} />}
      {currentCountry === 'Singapore' ? t('typography1SG') : t('typography1')}
      <Box>
        {currentCountry !== FixedCountry.Japan && (
          <Link href={{ pathname: '/self-agreement', query: { agreement_id: agreementId, site_id: siteId } }} passHref>
            <a className={classes.rootLink} target="_blank" rel="noreferrer">
              {t('link1')}
            </a>
          </Link>
        )}
        {getPolicy(t, currentCountry, 0)?.map((link, index) => (
          <a className={classes.rootLink} href={link.address} rel="noreferrer" target="_blank" key={index}>
            <Typography className={classes.link}>
              {link?.title}
            </Typography>
          </a>
        ))}
      </Box>
    </Grid>
  );
};

export default inject(AUTH_STORE_KEY)(observer(Invoice));
