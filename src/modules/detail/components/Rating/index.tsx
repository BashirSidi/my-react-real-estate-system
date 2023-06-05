import { Box, makeStyles, Typography } from '@material-ui/core';
import ClevertapReact from 'clevertap-react';
import { inject, observer } from 'mobx-react';
import { useCurrentCountry } from 'utilities/market';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import { ISite } from 'shared/interfaces';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { IIntercomClevertapPayload } from '../../../../components/Intercom';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column',
      alignItems: 'flex-start',
    },
  },
  stars: {
    marginRight: '6px',
  },
  textBox: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
  },
  reviewsText: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  line: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '5px',
    },
  },
  whatsapp: {
    marginBottom: '-5px',
    width: '125px',
    height: '30px',
    marginLeft: '10px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '10px',
      marginLeft: '-5px',
      marginBottom: '0',
    },
  },
}));

interface IProps {
  site?: ISite;
  setIsOpen: (isOpen: boolean) => void;
  [AUTH_STORE_KEY]?: AuthStore;
}

const Rating: React.FC<IProps> = ({ setIsOpen, auth, site }) => {
  const classes = useStyles();
  const { t } = usePageTranslation('details', 'Rating');
  const country = useCurrentCountry();

  const sendEvents = (value: string) => {
    const trackingPayload: IIntercomClevertapPayload = {
      type: value,
      customerEmail: auth?.user?.email,
      customerPhone: auth?.user?.phone_number,
      customerName: `${auth?.user?.first_name}${auth?.user?.last_name}`,
      userId: auth?.user?.id || 0,
      currency: country.currency,
      status: '',
      siteName: site?.name_en ?? '',
      country: country.name,
    };
    let eventName = '';
    if (value === 'line') eventName = IEventName.LINE_CLICKED;
    if (value === 'whatsapp') eventName = IEventName.WHATSAPP_CLICKED;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
    return true;
  };

  return (
    <Box className={classes.root}>
      {/* Rating to be added later when yotpo reviews are integrated */}
      <Box display="flex" alignItems="center">
        <Image className={classes.stars} name="stars" folder="DetailPage" />
        <Typography className={classes.reviewsText} onClick={() => setIsOpen(true)} variant="body2">
          {`${t('typography')}`}
        </Typography>
      </Box>
      {country.socialLink.line && (
        <a onClick={() => sendEvents('line')} href={country.socialLink.line} rel="noreferrer" target="_blank">
          <Image className={classes.line} name="line" folder="DetailPage" />
        </a>
      )}
      {country.socialLink.whatsapp
        && (
          <a onClick={() => sendEvents('whatsapp')} href={country.socialLink.whatsapp} rel="noreferrer" target="_blank">
            <Image className={classes.whatsapp} name="whatsapp" folder="DetailPage" />
          </a>
        )}
    </Box>
  );
};

export default inject(AUTH_STORE_KEY)(observer(Rating));
