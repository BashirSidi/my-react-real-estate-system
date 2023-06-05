import React from 'react';
import {
  Box, Typography, makeStyles,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import Link from 'next/link';
import usePageTranslation from '../../../../hooks/usePageTranslation';

import { BookingStore, BOOKING_STORE } from '../../stores/BookingStore';

interface IProps {
  [BOOKING_STORE]?: BookingStore;
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    marginTop: '28px',
    paddingTop: '26px',
    borderTop: '2px solid rgba(0, 0, 0, 0.12)',
    [theme.breakpoints.up('sm')]: {
      border: 'none',
    },
  },
  link: {
    cursor: 'pointer',
    color: '#00A0E3',
    textDecoration: 'none',
  },
}));

const SiteAgreement: React.FC<IProps> = ({
  bookingStore,
}) => {
  const { t } = usePageTranslation('checkout', 'SiteAgreement');
  const classes = useStyles();

  const AgreementLink = () => (
    <Link href={{ pathname: '/self-agreement', query: { agreement_id: bookingStore?.space?.site?.agreement?.id, site_id: bookingStore?.space?.site?.id } }} passHref>
      <a className={classes.link} target="_blank" rel="noreferrer">
        {t('typography2')}
      </a>
    </Link>
  );
  return (

    <Box className={classes.root}>
      <Typography variant="body1" color="initial">
        {t('typography1')}
        {' '}
        <AgreementLink />
        {' '}
        .
      </Typography>
    </Box>

  );
};

export default inject(BOOKING_STORE)(observer(SiteAgreement));
