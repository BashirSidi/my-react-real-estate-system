import {
  Box, fade, Grid, Hidden, IconButton, makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import { APP_ENV } from 'config';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CarouselPopup from '../../../../components/CarouselPopup';
import Image from '../../../../components/Image';
import ImageLoader from '../../../../components/ImageLoader';
import { getResizedURL } from '../../../../utilities/imageResizer';
import Model3D from '../Model3D';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '50px',
    marginBottom: '20px',
    position: 'relative',

    [theme.breakpoints.only('xs')]: {
      marginTop: '0px',
      marginBottom: '0px',
      padding: '24px 24px 5px',
    },
  },
  imgWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '15px',
    backgroundColor: fade(theme.palette.grey[50], 0.8),
  },
  mainImageWrapper: {
    height: '400px',
    position: 'relative',

    [theme.breakpoints.only('xs')]: {
      height: '190px',
    },
  },
  secondaryImage: {
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  secondaryImageWrapper: {
    height: '190px',
    marginLeft: '20px',
    marginBottom: '20px',
    minWidth: '400px',

    [theme.breakpoints.only('xs')]: {
      marginLeft: '10px',
      height: '90px',
      minWidth: '120px',
      marginBottom: '10px',
    },
  },
  smallImage: {
    [theme.breakpoints.only('xs')]: {
      width: '45%',
      marginLeft: '1%',
      marginRight: '1%',
    },
  },
  smallImageWrapper: {
    height: '190px',
    marginLeft: '20px',
    minWidth: '190px',

    [theme.breakpoints.only('xs')]: {
      marginLeft: '10px',
      height: '90px',
      minWidth: '100%',
    },
  },
  imgSkeleton: {
    backgroundColor: fade(theme.palette.grey[50], 0.8),
  },
  img: {
    minWidth: '100%',
    minHeight: '100%',
    height: 'inherit',
    width: 'inherit',
    maxHeight: 'inherit',
    maxWidth: 'inherit',
    objectFit: 'cover',
    objectPosition: 'center',
    cursor: 'pointer',
  },
  backBtnWrapper: {
    position: 'absolute',
    left: '-3px',
    top: '-3px',
  },
  placeholder: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      alignSelf: 'center',
      width: '110px',

      [theme.breakpoints.only('xs')]: {
        width: '70px',
      },
    },
  },
  moreImages: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 700,
    color: fade('#FFFFFF', 0.8),
    cursor: 'pointer',
    backgroundColor: fade(theme.palette.grey[200], 0.5),
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  virtual: {
    position: 'absolute',
    cursor: 'pointer',
    width: '130px',
    height: '33px',
    top: '15px',
    left: '15px',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '90px',
      height: '24px',
      top: '35px',
      left: '32vw',
    },
  },
}));

interface IProps {
  images: string[];
  loading: boolean;
  trackVirtualView: () => void;
  url3d: string | undefined
}

const Header: React.FC<IProps> = ({
  images, loading, trackVirtualView, url3d,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [sliderOpen, setOpen] = useState(false);
  const [isVirtualViewOpen, setIsVirtualViewOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleVirtualClick = () => {
    setIsVirtualViewOpen(true);
    trackVirtualView();
  };

  return (
    <Box className={classes.wrapper}>
      {!loading && url3d && (
        <Image
          folder="DetailPage"
          name="virtualView"
          className={classes.virtual}
          onClick={handleVirtualClick}
        />
      )}
      {url3d && (
        <Model3D
          url3d={url3d}
          isOpen={isVirtualViewOpen}
          setIsOpen={setIsVirtualViewOpen}
        />
      )}
      <CarouselPopup
        isOpen={sliderOpen}
        handleVirtualClick={handleVirtualClick}
        showVirtualViewIcon={!!url3d}
        initialIndex={initialIndex}
        images={images.map((i) => getResizedURL(i, { width: 1500 }))}
        onClose={() => setOpen(false)}
      />
      <Grid container>
        <Grid item xs={7} sm={7}>
          <Box className={clsx(classes.mainImageWrapper, classes.imgWrapper)}>
            <Hidden smUp>
              <Box className={classes.backBtnWrapper}>
                <IconButton component="span" onClick={() => router.back()}>
                  <Image name="backIcon" folder="DetailPage" />
                </IconButton>
              </Box>
            </Hidden>

            {!loading && !images[0] && (
              <Box className={classes.placeholder}>
                <Image name="placeholder" folder="DetailPage" extension="png" />
              </Box>
            )}

            <ImageLoader
              loading={loading}
              placeholder={(
                <Skeleton
                  variant="rect"
                  className={classes.imgSkeleton}
                  height={400}
                  width="100%"
                  animation="wave"
                />
              )}
            >
              {!loading && images[0] && (
                <img
                  className={classes.img}
                  onClick={() => {
                    setInitialIndex(0);
                    setOpen(true);
                  }}
                  src={getResizedURL(images[0], { width: 700 })}
                  alt="Main site cover"
                />
              )}
            </ImageLoader>
          </Box>
        </Grid>
        <Grid item xs={5} sm={5}>
          <Grid container>
            <Grid item sm={12} className={classes.secondaryImage}>
              <Box className={clsx(classes.secondaryImageWrapper, classes.imgWrapper)}>
                <ImageLoader
                  loading={loading}
                  placeholder={(
                    <Skeleton
                      variant="rect"
                      className={classes.imgSkeleton}
                      height={190}
                      width="100%"
                      animation="wave"
                    />
                  )}
                >
                  {!loading && images[1] && (
                    <img
                      className={classes.img}
                      onClick={() => {
                        setInitialIndex(1);
                        setOpen(true);
                      }}
                      src={getResizedURL(images[1], { width: 450 })}
                      alt="Secondary small cover"
                    />
                  )}
                </ImageLoader>

                {!loading && !images[1] && (
                  <Box className={classes.placeholder}>
                    <Image name="placeholder" folder="DetailPage" extension="png" />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item sm={12} className={classes.secondaryImage}>
              <Grid container>
                <Grid item sm={6} className={classes.smallImage}>
                  <Box className={clsx(classes.smallImageWrapper, classes.imgWrapper)}>
                    <ImageLoader
                      loading={loading}
                      placeholder={(
                        <Skeleton
                          variant="rect"
                          className={classes.imgSkeleton}
                          height={190}
                          width="100%"
                          animation="wave"
                        />
                      )}
                    >
                      {!loading && images[2] && (
                        <img
                          className={classes.img}
                          onClick={() => {
                            setInitialIndex(2);
                            setOpen(true);
                          }}
                          src={getResizedURL(images[2], { width: 300 })}
                          alt="Small site"
                        />
                      )}
                    </ImageLoader>
                    {!loading && !images[2] && (
                      <Box className={classes.placeholder}>
                        <Image name="placeholder" folder="DetailPage" extension="png" />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item sm={6} className={classes.smallImage}>
                  <Box className={clsx(classes.smallImageWrapper, classes.imgWrapper)}>
                    <Hidden only="xs">
                      {(images.length - 4) > 0 && (
                        <Box
                          className={classes.moreImages}
                          onClick={() => {
                            setInitialIndex(3);
                            setOpen(true);
                          }}
                        >
                          +
                          {images.length - 4}
                        </Box>
                      )}
                    </Hidden>
                    <ImageLoader
                      loading={loading}
                      placeholder={(
                        <Skeleton
                          variant="rect"
                          className={classes.imgSkeleton}
                          height={190}
                          width="100%"
                          animation="wave"
                        />
                      )}
                    >
                      {!loading && images[3] && (
                        <img
                          className={classes.img}
                          src={getResizedURL(images[3], { width: 300 })}
                          onClick={() => {
                            setInitialIndex(3);
                            setOpen(true);
                          }}
                          alt="Small site"
                        />
                      )}
                    </ImageLoader>
                    {!loading && !images[3] && (
                      <Box className={classes.placeholder}>
                        <Image name="placeholder" folder="DetailPage" extension="png" />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
