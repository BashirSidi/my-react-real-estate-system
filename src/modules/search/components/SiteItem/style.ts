import { fade, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    border: '2px solid rgba(243, 247, 249, 1)',
    borderRadius: '15px',
    padding: '28px 14px 14px',
    marginTop: '10px',
    maxWidth: '685px',
    [theme.breakpoints.up('sm')]: {
      padding: '28px 30px 14px',
    },
  },
  featured: {
    border: '2px solid rgba(234, 91, 33, 0.4)',

    [theme.breakpoints.only('xs')]: {
      marginTop: '0',
    },
  },
  featuredImageBox: {
    [theme.breakpoints.only('xs')]: {
      height: '130px !important',
      width: '145px !important',
      '& img': {
        width: '145px',
        height: '130px',
      },
    },
    [theme.breakpoints.up('sm')]: {
      height: '200px !important',
      width: '200px !important',
      '& img': {
        width: '200px',
        height: '200px',
      },
    },
  },
  topPics: {
    height: '82px',
    [theme.breakpoints.down('xs')]: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '82px',
      width: '207px',
      top: 0,
      position: 'initial',
      margin: 0,
    },
  },
  header: {
    display: 'flex',
    paddingBottom: '10px',
  },
  featuredBox: {
    marginTop: '6px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: '#FFD8C8',

    '& p': {
      color: `${theme.palette.secondary.main} !important`,
    },
  },
  importantText: {
    fontWeight: 600,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  orange: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '15px',
    backgroundColor: theme.palette.secondary.main,
    marginBottom: '10px',
  },
  success: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '15px',
    backgroundColor: theme.palette.success.main,
    marginBottom: '10px',
  },
  typographyOrange: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'uppercase',
  },
  property: {
    display: 'flex',
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: '4px',
    marginTop: '10px',
  },
  textNearButton: {
    fontSize: '1.4rem',
    fontWeight: 500,
    color: theme.palette.success.main,
  },
  maxWidth: {
    maxWidth: '150px',
  },
  promoBox: {
    maxWidth: '200px',
  },
  textButton: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: '#FFFFFF',
  },
  img: {
    minHeight: '100%',
    minWidth: '100%',
    maxHeight: 'inherit',
    maxWidth: 'inherit',
    objectFit: 'cover',
    objectPosition: 'center',
    cursor: 'pointer',
  },
  imageBox: {
    minHeight: '120px',
    minWidth: '120px',
    maxHeight: '215px',
    maxWidth: '215px',
    overflow: 'hidden',
    borderRadius: '16px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.only('xs')]: {
      height: '120px',
      width: '120px',
      '& img': {
        width: '120px',
        height: '120px',
      },
    },
    [theme.breakpoints.up('sm')]: {
      height: '200px',
      width: '200px',
      '& img': {
        width: '200px',
        height: '200px',
      },
    },
  },
  spacesWrapper: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '5px',
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '20px',
    },
  },
  promotionText: {
    color: theme.palette.success.main,
    fontWeight: 700,
  },
  featuredImages: {
    position: 'relative',
  },
  featuredHeader: {
    position: 'absolute',
    left: 0,
    bottom: '-50px',
    zIndex: 2,
  },
  imgWrapper: {
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '15px',
    backgroundColor: fade(theme.palette.grey[50], 0.8),

    '& img': {
      alignSelf: 'center',
    },
  },
  mainImageWrapper: {
    height: '325px',
  },
  smallImageWrapper: {
    height: '155px',
    marginLeft: '15px',
  },
  featuredLabel: {
    width: '150px',
  },
  clickable: {
    cursor: 'pointer',
  },
  top: {
    width: '207px',
    height: '74px',
    minHeight: '74px',
    maxHeight: '74px',
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
      marginTop: '-32px',
    },
  },
  estimateCard: {
    margin: '15px 0',
    padding: '10px',
    border: '1px solid #E9E9E9',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },
  imageWithFeatured: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '30px',
    },
  },
  imageWithOutFeatured: {
    marginLeft: '25px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
    },
  },
  avgPriceTitleText: {
    color: '#333333',
    fontWeight: 400,
    fontSize: '14px',
  },
  avgPriceText: {
    [theme.breakpoints.only('xs')]: {
      fontSize: '12px',
    },
    color: '#EA5B21',
    fontWeight: 600,
    fontSize: '14px',
    marginTop: '10px',
  },
  fullCard: {
    marginRight: '20px',
  },
  fullEstimateBtn: {
    background: theme.palette.secondary.main,
    borderRadius: '12px',
    color: 'white',
    marginTop: '15px',
    width: '80%',
  },
  estimateBtn: {
    background: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '15px',
    marginLeft: '10px',
    whiteSpace: 'nowrap',
    '&:hover': {
      color: 'white',
      background: fade(theme.palette.secondary.main, 0.8),
    },
  },
}));
