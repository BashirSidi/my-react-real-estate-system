import React, { FC, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import ClevertapReact from 'clevertap-react';
import { getTranslatedName, useCurrentCountry } from 'utilities/market';
import { ISpaceType, ITrackingEstimator } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';
import EstimatorStore, { ESTIMATOR_STORE } from '../../stores/EstimatorStore';
import Image from '../../../../components/Image';
import Item from './Item';

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
    },
  },
  categories: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    '& img': {
      color: '#C4C4C4',
      height: '32px',
      minWidth: '32px',
    },
  },
  items: {
    display: 'flex',
    width: 'fit-content',
    padding: '0 30px',
    transition: '0.5s',
    transform: 'translateX(0)',
    [theme.breakpoints.up('sm')]: {
      margin: 0,
      padding: 0,
    },
  },
  item: {
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '96px',
    height: '65px',
    border: '1px solid #C4C4C4',
    [theme.breakpoints.up('sm')]: {
      width: '124px',
      height: '84px',
    },
    '&:not(:last-of-type)': {
      marginRight: '5px',
      [theme.breakpoints.up('sm')]: {
        marginRight: '6px',
      },
    },
    '&.active': {
      backgroundColor: '#00A0E3',
      borderColor: '#00A0E3',
      '& h5': {
        color: '#FFFFFF',
      },
      '& img': {
        filter: 'brightness(0) invert(1)',
      },
    },
    '&>*': {
      textAlign: 'center',
    },
  },
  title: {
    color: '#C4C4C4',
    fontSize: '12px',
    lineHeight: '14px',
  },
  navigation: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#FFFFFF',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1,
    '& img': {
      width: '6px',
      height: '10px',
    },
  },
  preview: {
    left: '24px',
    transform: 'rotateZ(180deg)',
  },
  next: {
    right: '24px',
  },
  hidden: {
    display: 'none',
  },
}));

interface IProps {
  spaceType?: ISpaceType;
  [ESTIMATOR_STORE]?: EstimatorStore;
  [AUTH_STORE_KEY]?: AuthStore;
}

const Categories: FC<IProps> = ({
  spaceType,
  estimatorStore: {
    categories, categoryId: categoryIndex, selectCategory, selectedItems,
  }, auth,
}) => {
  const { locale } = useRouter();
  const classes = useStyles();
  const [width] = useState(
    categories.length * 96 + (categories.length - 1) * 10,
  );
  const [scroll, setScroll] = useState(0);
  const [offsetRight, setOffsetRight] = useState(0);
  const onResize = () => {
    setOffsetRight(width - document.body.clientWidth);
  };
  const country = useCurrentCountry()?.name;
  useEffect(() => {
    setOffsetRight(width - document.body.clientWidth);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const sendCleverTap = (romType) => {
    const trackingPayload: ITrackingEstimator = {
      customerEmail: auth?.user?.email,
      customerPhone: auth?.user?.phone_number,
      customerName: `${auth?.user?.first_name}${auth?.user?.last_name}`,
      language: locale,
      country,
      platform: 'WEB',
      districtName: '',
      city: '',
      roomType: romType,
      objectsType: selectedItems.map((item) => item.name_en).toString(),
      totalBoxes: selectedItems.reduce((total, item) => item.count + total, 0),
      recommendedPlan: `${spaceType?.name_en}`,
    };
    const eventName = IEventName.ESTIMATOR_ROOM_CLICKED;
    gtag.track(eventName, trackingPayload);
    intercom.track(eventName, trackingPayload);
    ClevertapReact.event(eventName, trackingPayload);
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.categories}>
        <Box className={`${classes.navigation} ${classes.preview} ${scroll === 0 ? classes.hidden : ''}`} onClick={() => setScroll(scroll - 180)}>
          <Image name="arrow" folder="Navigation" />
        </Box>
        <Box className={classes.items} style={{ transform: `translateX(-${scroll}px)` }}>
          {categories.map((category, index) => (
            <Item
              name={getTranslatedName(category, 'name', locale)}
              icon={category.icon}
              className={`${classes.item} ${categoryIndex === category.id ? 'active' : ''}`}
              key={index}
              textClass={classes.title}
              onClick={() => {
                selectCategory(category.id);
                sendCleverTap(category.name_en);
              }}
            />
          ))}
        </Box>
        <Box className={`${classes.navigation} ${classes.next} ${scroll >= offsetRight ? classes.hidden : ''}`} onClick={() => setScroll(scroll + 180)}>
          <Image name="arrow" folder="Navigation" />
        </Box>
      </Box>
    </Box>
  );
};

export default inject(ESTIMATOR_STORE, AUTH_STORE_KEY)(observer(Categories));
