import React, { useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { makeStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import {
  Box, Grid, Theme, useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import 'keen-slider/keen-slider.min.css';
import { toJS } from 'mobx';
import { BOX_TO_BOX } from 'config';
import {
  BookingStore,
  BOOKING_STORE,
} from '../../../../../stores/BookingStore';
import { BookingServicesQuery_services } from '../../../../../queries/__generated__/BookingServicesQuery';
import Image from '../../../../../../../components/Image';
import styles from './slider.module.css';
import NoPickupService from './NoPickupService';
import ServiceItem from './ServiceItem';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '22px',
  },
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.8rem',
    },
  },
  subtitleBox: {
    margin: '10px 0 4px 6px',
    [theme.breakpoints.up('sm')]: {
      margin: '14px 0 14px 6px',
    },
  },
  subtitleText: {
    fontWeight: 600,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.4rem',
    },
  },
  selectAdornment: {
    position: 'absolute',
    padding: 0,
    right: '50px',
    top: '50%',
  },
  adornmentText: {
    fontWeight: 400,
    fontSize: '1.6rem',
  },
  listBox: {
    marginTop: '-25px',
    marginLeft: '-33px',
    paddingRight: '4px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '-10px',
    },
  },
  listItem: {
    padding: '0 10px',
    '& span': {
      fontSize: '1.2rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '14px',
      },
    },
  },
  itemIcon: {
    minWidth: '20px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '-10px',
    },
  },
  inputSelect: {
    fontWeight: 400,
    fontSize: '1.2rem',
    padding: '13px 26px 13px 12px',
    border: '0px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.6rem',
    },
  },
  carouselContainer: {
    paddingTop: '15px',
    width: '112%',
    minWidth: 'unset',
    position: 'relative',
    marginLeft: '-35px',
    overflow: 'hidden',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      minWidth: '543px',
      width: '100%',
      marginLeft: '-30px',
    },
  },
  carousel: {
    position: 'relative',
    transition: '1s',
    borderRadius: '16px',
    height: 'fit-content',
  },
  arrow: {
    background: '#E9E9E9',
    opacity: 0.7,
    borderRadius: '50%',
    '& svg': {
      height: '9px',
      width: '17px',
    },
    '& :hover': {
      cursor: 'pointer',
    },
  },
  arrowLeft: {
    marginRight: '20px',
  },
  arrowRight: {
    marginLeft: '20px',
  },
  dots: {
    '& button': {
      background: 'transparent',
    },
  },
}));

interface IProps {
  bookingStore?: BookingStore;
  items: BookingServicesQuery_services;
  manPower: number;
}

function filterVehicleForBoxToBox(serviceList) {
  const mediumTruck = 'lorry14';
  const bigTruck = 'lorry24';
  // Hide Medium and Big truck
  return serviceList.filter(
    (item) => item.vehicle_code !== bigTruck && item.vehicle_code !== mediumTruck,
  );
}

const ChooseYourService: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { bookingStore, items, manPower } = props;
  const isBoxToBox = bookingStore?.booking?.site_name === BOX_TO_BOX;
  const spaceSize = toJS(
    bookingStore?.booking?.original_space?.space_type?.name_en,
  );
  const filteredItems = items.edges;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slidesPerView: 2,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
  });

  useEffect(() => {
    if (slider) slider.resize();
  }, [filteredItems]);

  const ArrowLeft = ({ onClick }) => (
    <Image
      onClick={onClick}
      className={`${styles.arrow} ${styles.arrow__left}`}
      name="arrow-left"
      folder="Homepage"
      asInlineEl
    />
  );

  const ArrowRight = ({ onClick, disabled: isDisabled }) => {
    const disabled = isDisabled ? styles.arrow__disabled : '';
    return (
      <Image
        onClick={onClick}
        className={`${styles.arrow} ${styles.arrow__right} ${disabled}`}
        name="arrow-right"
        folder="Homepage"
        asInlineEl
      />
    );
  };

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  return (
    <Box className={classes.root}>
      <Grid container>
        <Box className={classes.listBox}>
          <List disablePadding>
            <ListItem className={classes.listItem} style={{ color: '#989898' }}>
              <ListItemIcon className={classes.itemIcon}>
                <Image name="circle-check" folder="CheckoutPage" extension="svg" />
              </ListItemIcon>
              <ListItemText
                primary={`Door to Door : Professional movers take your belongings from your house to the facility. ${isBoxToBox ? 'Please note that an additional S$15 will be added automatically to the total price for Door to Door service.' : ''}`}
              />
            </ListItem>
            {!isBoxToBox && (
              <ListItem className={classes.listItem}>
                <ListItemIcon className={classes.itemIcon}>
                  <Image name="warning" folder="CheckoutPage" extension="svg" />
                </ListItemIcon>
                <ListItemText
                  primary="Vehicle size can be smaller than your stuff"
                />
              </ListItem>
            )}
          </List>
        </Box>
        <Box className={classes.carouselContainer}>
          <Box className={classes.carousel}>
            <>
              <div className="navigation-wrapper">
                <div ref={sliderRef} className="keen-slider">
                  {!isBoxToBox && (
                    <Grid
                      item
                      xs={12}
                      className={`${styles.slide} keen-slider__slide`}
                    >
                      <NoPickupService bookingStore={bookingStore} />
                    </Grid>
                  )}
                  {(isBoxToBox
                    ? filterVehicleForBoxToBox(filteredItems)
                    : filteredItems
                  ).map((item) => (
                    <Grid
                      key={item.id}
                      item
                      xs={12}
                      className={`${styles.slide} keen-slider__slide`}
                    >
                      <ServiceItem
                        item={item}
                        bookingStore={bookingStore}
                        spaceSize={spaceSize}
                        manPower={manPower}
                        value={bookingStore.serviceId === item.id}
                      />
                    </Grid>
                  ))}
                </div>
                {!isMobile && slider && (
                  <>
                    {currentSlide !== 0 && (
                      <ArrowLeft
                        onClick={(e) => e?.stopPropagation() || slider.prev()}
                      />
                    )}
                    <ArrowRight
                      onClick={(e) => e?.stopPropagation() || slider.next()}
                      disabled={currentSlide === slider.details().size - 1}
                    />
                  </>
                )}
              </div>
              {!isBoxToBox && slider && (
                <div className={styles.dots}>
                  {[...Array(slider.details().size - 1).keys()].map((idx) => (
                    <span
                      key={idx}
                      className={`${styles.dot} ${
                        currentSlide === idx ? styles.active : ''
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default inject(BOOKING_STORE)(observer(ChooseYourService));
