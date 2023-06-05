import {
  Box, makeStyles, Typography, useMediaQuery, Theme, Divider,
} from '@material-ui/core';
import React, { FC } from 'react';
import { Carousel } from '../../../FeaturedListings/KeenCarousel';
import { TypographySkeleton } from '../../../FeaturedListings/SkeletonLoader';

const useStyles = makeStyles((theme) => ({
  title34: {
    margin: '30px 0',
    width: '10%',
  },
  section3: {
    padding: '30px 0',
    position: 'relative',
  },
  boxCards: {
    display: 'flex',
    justifyContent: 'center',
    gap: 50,
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      flexDirection: 'column',
    },
  },
  boxCard: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 30,
    backgroundColor: '#FFFFFF',
    border: '2px solid #E9E9E9',
    width: 250,
    borderRadius: 20,
  },
  boxCardBody: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  button: {
    width: '25%',
    padding: '0 0 30px',
  },
}));

const SkeletonLoader: FC = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <Divider />
      <Box className={classes.section3}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography className={classes.title34}>
            <TypographySkeleton height={25} />
          </Typography>
        </Box>
        { isMobile
          ? (
            <Carousel>
              {[1, 2].map((box, i) => (
                <Box key={i} className={`keen-slider__slide ${classes.boxCard}`}>
                  <TypographySkeleton height={144} />
                  <Box className={classes.boxCardBody}>
                    <Box display="flex" width="100%">
                      <TypographySkeleton height={30} />
                      &nbsp;
                      <TypographySkeleton height={30} />
                    </Box>
                    <Box width="100%">
                      <TypographySkeleton height={30} />
                      <TypographySkeleton height={30} />
                      <TypographySkeleton height={30} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Carousel>
          )
          : (
            <Box className={classes.boxCards}>
              {[1, 2].map((box, i) => (
                <Box key={i} className={`keen-slider__slide ${classes.boxCard}`}>
                  <TypographySkeleton height={144} />
                  <Box className={classes.boxCardBody}>
                    <Box display="flex" width="100%">
                      <TypographySkeleton height={30} />
                      &nbsp;
                      <TypographySkeleton height={30} />
                    </Box>
                    <Box width="100%">
                      <TypographySkeleton height={30} />
                      <TypographySkeleton height={30} />
                      <TypographySkeleton height={30} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography className={classes.button}>
          <TypographySkeleton height={60} />
        </Typography>
      </Box>
    </>
  );
};

export default SkeletonLoader;
