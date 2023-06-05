import { Box, makeStyles } from '@material-ui/core';
import usePageTranslation from 'hooks/usePageTranslation';
import { inject, observer } from 'mobx-react';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { getCurrentAnonymousUserId } from 'utilities/user';
import * as clevertap from 'utilities/clevertap';
import { useCurrentCountry } from 'utilities/market';
import SelectPlace from './SelectPlace';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    maxWidth: '1040px',
    margin: '0 auto',
    paddingBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '100px',
    },
  },
  head: {
    display: 'flex',
    flexFlow: 'column',
    marginTop: '15px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '30px',
    lineHeight: '30px',
    margin: '15px 0',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      lineHeight: '20px',
      marginTop: '5px',
    },
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
}));

interface IProps {
  [AUTH_STORE_KEY]?: AuthStore
}
const PlacesForm: React.FC<IProps> = ({ auth }) => {
  const classes = useStyles();
  const { lang } = useTranslation();
  const countryName = useCurrentCountry().name;
  const { t } = usePageTranslation('places', 'FormLocation');

  useEffect(() => {
    const userId = auth?.user?.id ?? getCurrentAnonymousUserId();
    const payload = {
      auth,
      userId,
      countryName,
      language: lang,
    };
    clevertap.identifyUser(payload);

    // eslint-disable-next-line
  }, []);

  return (
    <Box className={classes.root}>
      <SelectPlace />
    </Box>
  );
};

export default inject(AUTH_STORE_KEY)(observer(PlacesForm));
