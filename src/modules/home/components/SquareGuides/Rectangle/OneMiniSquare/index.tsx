import {
  Box,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ClevertapReact from 'clevertap-react';
import { PopupButton } from '@typeform/embed-react';
import { ESTIMATION_FORM_ID } from 'config';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import * as intercom from 'utilities/intercom';
import { useCurrentCountry } from '../../../../../../utilities/market';
import * as gtag from '../../../../../../utilities/gtag';
import { ITrackingEstimator } from '../../../../../../shared/interfaces';
import IEventName from '../../../../../../shared/event-name.enum';

const useStyles = makeStyles((theme: Theme) => ({
  preRoot: {
    paddingTop: '100%',
  },
  title: {
    color: '#333333',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 1,
    width: '100%',
    height: '100%',
    padding: '23px 20px',
    [theme.breakpoints.up('md')]: {
      // padding: '50px 40px',
    },
    cursor: 'pointer',
    '&:hover': {
      position: 'absolute',
      top: '0px',
      left: '0px',
      zIndex: 1,
      width: '100%',
      height: '100%',
      padding: '23px 20px',
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up('md')]: {
        borderRadius: '32px',
        // padding: '50px 40px',
      },
      '& $title': {
        color: '#FFFFFF',
      },
      '& svg path': {
        fill: 'white !important',
      },
      '& img': {
        filter: 'brightness(0) invert(1)',
      },
    },
  },
  imgBox: {
    position: 'relative',
    paddingBottom: '20px',
    '& img': {
      [theme.breakpoints.up('xs')]: {
        height: '36px',
        width: '36px',
      },
      [theme.breakpoints.down('xs')]: {
        height: '25px',
        width: '25px',
      },
    },

    [theme.breakpoints.down('sm')]: {
      '& svg': {
        height: '25px',
        width: '25x',
      },
    },
  },
  textBox: {
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      '& h4': {
        fontSize: '24px',
        lineHeight: '30px',
      },
    },
  },
  popupButton: {
    textAlign: 'left',
    background: 'none',
    border: 'none',
  },
}));

type Props = {
  name: string;
  title: string;
  link?: string;
  id: string;
  [AUTH_STORE_KEY]?: AuthStore;
};

const OneMiniSquare: React.FC<Props> = (props) => {
  const {
    name, title, link, id, auth,
  } = props;
  const classes = useStyles();
  const router = useRouter();
  const { lang } = useTranslation();
  const country = useCurrentCountry();
  const sendCleverTap = (url:string) => {
    const isEstimatorBoxLink = url.includes('box');
    const trackingBoxEstimatorPayload: ITrackingEstimator = {
      customerEmail: auth?.user?.email || '',
      customerPhone: auth?.user?.phone_number || '',
      customerName: auth?.user?.first_name || '',
      language: lang,
      country: country?.name,
      platform: 'WEB',
      districtName: '',
      city: '',
      boxSize: 0,
      totalBoxes: 0,
      recommendedPlan: '',
    };
    const trackingRoomEstimatorPayload: ITrackingEstimator = {
      customerEmail: auth?.user?.email || '',
      customerPhone: auth?.user?.phone_number || '',
      customerName: auth?.user?.first_name || '',
      language: lang,
      country: country?.name,
      platform: 'WEB',
      districtName: '',
      city: '',
      roomType: '',
      objectsType: '',
      totalBoxes: 0,
      recommendedPlan: '',
    };
    const eventName = isEstimatorBoxLink
      ? IEventName.ESTIMATOR_BOX_CLICKED
      : IEventName.ESTIMATOR_ROOM_CLICKED;
    const trackingPayload = isEstimatorBoxLink
      ? trackingBoxEstimatorPayload : trackingRoomEstimatorPayload;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
  };
  const content = (url?:string) => (
    <Box className={classes.root} id={id} onClick={() => url && sendCleverTap(url)}>
      <Box className={classes.imgBox}>
        <img src={`/images/Homepage/${name}.svg`} alt={`${name}`} />
      </Box>
      <Box className={classes.textBox}>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box className={classes.preRoot}>

      {link ? (
        <Link href={link}>
          {content(link)}
        </Link>
      ) : (
        <Box className={classes.root}>
          <PopupButton id={ESTIMATION_FORM_ID} className={classes.popupButton}>
            {content()}
          </PopupButton>
        </Box>
      )}
    </Box>
  );
};

export default OneMiniSquare;
