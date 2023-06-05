import {
  Box, CircularProgress, Grid, makeStyles,
} from '@material-ui/core';

import { useQuery } from '@apollo/client';
import { AGREEMENT_QUERY } from 'modules/agreement/queries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getTranslatedName } from 'utilities/market';

const useStyles = makeStyles((theme) => ({
  content: {
    maxWidth: '1100px',
    padding: '20px',
    backgroundColor: 'white',
    margin: 'auto',
    minWidth: '300px',
    height: 'fit-content',
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '30px',
      height: '100vh',
    },
    [theme.breakpoints.down('md')]: {
      margin: '50vw 5px 0px 5px',
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
  },
  terms: {
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: 400,
    resize: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: '20px',
      height: '500px',
      fontSize: '16px',
      marginTop: '20px',
    },
  },
  loading: {
    marginTop: '30%',
  },
}));

const SelfAgreement: React.FC = () => {
  const router = useRouter();
  const agreementId = Number(router.query?.agreement_id);
  const siteId = Number(router.query?.site_id) || 1;

  const classes = useStyles();

  const { data, loading } = useQuery(
    AGREEMENT_QUERY,
    {
      variables: {
        id: agreementId,
        site_id: siteId,
      },
    },
  );

  const renderHtmlString = (htmlString: string) => (
    // eslint-disable-next-line react/no-danger
    <div className={classes.terms} dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
  return (
    <Box className={classes.content}>
      {loading && (
        <Grid className={classes.loading} container justify="center">
          <CircularProgress />
        </Grid>
      )}
      <Box className={classes.body}>
        {renderHtmlString(getTranslatedName(data?.agreement, 'content', router.locale))}
      </Box>
    </Box>
  );
};

export default SelfAgreement;
