import {
  AppBar,
  makeStyles,
  Box,
  IconButton,
  Grid,
  useMediaQuery,
  Theme,
  Typography,
} from '@material-ui/core';
import Switcher from 'components/Switcher';
import Image from 'components/Image';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentCountry } from 'utilities/market';
import clsx from 'clsx';
import { useNewVersion } from 'hooks/useNewVersion';
import IFlagFeatures, { ISiteDetailsVersion } from 'shared/flag-features.enum';
import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import { inject, observer } from 'mobx-react';
import HamburgerMenu from '../../components/HamburgerMenu';
import { PrimaryButton } from '../../components/Buttons';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 101,
    height: '56px',
    boxShadow: '0px 10px 80px #E9E9E9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      height: '71px',
    },
  },
  boxBurger: {
    position: 'absolute',
    left: '18px',
    height: '100%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  imgBurger: {
    height: '30%',
    width: 'auto',
  },
  logoBox: {
    cursor: 'pointer',
    width: 'max-content',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: theme.palette.grey['100'],
    opacity: 0.1,
    height: '2px',
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: '1120px',
      margin: '0 auto',
    },
  },
  logoContainer: {
    width: '70px',
    height: '43.33px',
    display: 'flex',
    flexShrink: 1,
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      width: '84px',
      height: '52px',
    },
  },
  burger: {
    width: '25px',
    height: '21px',
  },
  logo: {
    width: '70px',
    height: '44px',
  },
  switchers: {
    display: 'flex',
    width: 'max-content',
    position: 'absolute',
    right: '1.4vw',
    height: '71px',
    alignItems: 'center',
    zIndex: 101,
    top: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  switchers2: {
    display: 'flex',
    width: 'max-content',
    height: '71px',
    alignItems: 'center',
    zIndex: 101,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  globe: { marginRight: '10px' },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: '10px 0',
    boxShadow: '0px 10px 80px #e9e9e9',
  },
  button: {
    maxWidth: '1040px',
    '& button': {
      [theme.breakpoints.up('sm')]: {
        padding: '14px 50px',
      },
    },
    '& button.textWhite': {
      fontWeight: 700,
      width: '125px',
      fontSize: '13px',
      borderRadius: '15px',
      padding: '14px 30px',
      color: '#FFFFFF',
    },
    '& button.textBlue': {
      fontWeight: 700,
      width: '125px',
      fontSize: '13px',
      borderRadius: '15px',
      padding: '14px 30px',
      color: '#00A0E3',
      backgroundColor: '#FFFFFF',
    },
    [theme.breakpoints.down('sm')]: {
      '& button.textWhite': {
        margin: '0 30px',
      },
      '& button.textBlue': {
        margin: '0 30px',
      },
    },
  },
  iconsWrapper: {
    display: 'flex',
    gap: 12,
    width: 'max-content',
    position: 'absolute',
    right: '1.4vw',
    height: '71px',
    alignItems: 'center',
    zIndex: 101,
    top: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  iconBox: {
    background: '#FFFFFF',
    width: 32,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxBorder: {
    border: '1px solid #E9E9E9',
    borderRadius: 5,
  },
  contacts: {
    fontWeight: 600,
    fontSize: '1.3rem',
  },
}));

type Props = {
  children?: React.ReactNode;
  noHeader?: boolean;
  hideMenu?: boolean;
  className?: string;
  isShowBackground?: boolean;
  footer?: boolean;
  nextBtn?: string;
  prevBtn?: string;
  onPrevClick?(): void;
  onNextClick?(): void;
  prevDisabled?: boolean
  nextDisabled?: boolean
  [AUTH_STORE_KEY]?: AuthStore;
  isForVersionB?: boolean;
};

export const HomeLayout: React.FC<Props> = (props) => {
  const classes = useStyles();
  const country = useCurrentCountry();
  const {
    children,
    noHeader = false,
    hideMenu = false,
    className = '',
    isShowBackground = false,
    footer,
    nextBtn,
    prevBtn,
    onNextClick,
    onPrevClick,
    prevDisabled,
    nextDisabled,
    auth,
    isForVersionB,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const handleChange = () => {
    setIsOpen(!isOpen);
  };
  const featureName = IFlagFeatures.SITE_DETAILS_TEST;
  const featureValue = ISiteDetailsVersion.SITE_DETAILS_B;
  const isNewVersion = useNewVersion({ auth, featureName, featureValue });
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const icons = [
    { iconName: 'fbIcon', link: country.socialLink.facebook },
    { iconName: 'igIcon', link: country.socialLink.instagram },
    { iconName: 'lineIcon', link: country.socialLink.line },
  ];

  const versionAHeader = (country.locales.length > 1 && (
    <Box className={classes.switchers}>
      <img className={classes.globe} src="/images/globe_dark.svg" alt="" />
      <Switcher comp="lang" isForVersionB={isForVersionB} />
    </Box>
  ));

  const versionBHeader = (
    <Box className={classes.iconsWrapper}>
      {
      icons?.map(({ iconName, link }) => (
        <Box
          key={iconName}
          className={clsx(classes.iconBox, classes.iconBoxBorder)}
          onClick={() => window.open(link, '_blank')}
        >
          <Image folder="Header" name={iconName} />
        </Box>
      ))
    }
      <Box className={classes.iconBox}>
        <Image folder="Header" name="phoneIcon" />
      </Box>
      <Box>
        <Typography className={classes.contacts}>
          +65 6353 9325
        </Typography>
      </Box>
      {
      country.locales.length > 1 && (
      <Box className={classes.switchers2}>
        <img className={classes.globe} src="/images/globe_dark.svg" alt="" />
        <Switcher comp="lang" isForVersionB={isForVersionB} />
      </Box>
      )
    }
    </Box>
  );

  return (
    <>
      {!noHeader && (
        <>
          <AppBar className={classes.root} position="static">
            {!hideMenu && (
              <Box className={classes.boxBurger}>
                <IconButton onClick={handleChange} id="openHamburgerMenuButton">
                  <Image
                    folder="Homepage"
                    className={classes.burger}
                    name="burger"
                  />
                </IconButton>
              </Box>
            )}
            <Link href="/">
              <Box className={classes.logoBox}>
                <Box className={classes.logoContainer}>
                  <Image className={classes.logo} name="logo" />
                </Box>
              </Box>
            </Link>
            { isNewVersion && isForVersionB ? versionBHeader : versionAHeader}
          </AppBar>
        </>
      )}
      <Box className={classes.divider} />
      <main
        className={clsx(classes.content, className, isShowBackground)}
      >
        {children}
        <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
      {footer && (
        <div className={clsx(classes.footer)}>
          <Grid
            container
            justify={isMobile ? 'center' : 'space-between'}
            className={classes.button}
          >
            <Grid>
              <PrimaryButton disabled={prevDisabled} className={prevDisabled ? 'textWhite' : 'textBlue'} onClick={onPrevClick}>
                {prevBtn}
              </PrimaryButton>
            </Grid>
            <Grid>
              <PrimaryButton disabled={nextDisabled} className="textWhite" onClick={onNextClick}>
                {nextBtn}
              </PrimaryButton>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default inject(AUTH_STORE_KEY)(observer(HomeLayout));
