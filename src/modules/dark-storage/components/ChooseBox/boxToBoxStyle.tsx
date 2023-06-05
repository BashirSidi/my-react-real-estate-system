import { makeStyles } from '@material-ui/core/styles';

const useStylesBoxToBox = makeStyles((theme) => ({
  root: {
    backgroundColor: '#FFFFFF',
    paddingTop: '17px',
    [theme.breakpoints.up('md')]: {
      paddingTop: '24px',
    },
    overflow: 'hidden',
    border: 'none',
    paddingBottom: '100px',
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      padding: '15px',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '5%',
    },
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
  },
  textSecond: {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  secondary: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#EA5B21',
  },
  primary: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#00A0E3',
  },
  gray: {
    color: '#333333',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    background: '#FFD8C8',
    borderRadius: '15px',
    padding: '10px 15px',
    width: '100%',
    margin: '30px 0',
  },
  btn: {
    background: '#00A0E3',
  },
  img: {
    margin: '10px 0',
    width: '100%',
  },
  infoIcon: {
    margin: '0 10px',
    width: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
  },
  boxPrice: { width: '30%', textAlign: 'end' },
  boxTitle: {
    width: '50%',
    textAlign: 'start',
  },
  boxUnit: { width: '20%', textAlign: 'start' },
  textBox: {
    margin: '20px',
    color: '#333333',
  },
  textPriceDetail: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 20px',
  },
  textTotal: {
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
  },
  textTotalPrice: {
    padding: '10px 0',
    width: '20%',
    textAlign: 'end',
  },
  textSmall: {
    fontSize: '12px',
  },
  bold: {
    fontWeight: 600,
  },
  hide: {
    display: 'none',
  },
  listBox: {
    border: '2px solid #E9E9E9',
    borderRadius: '10px',
    padding: '20px',
    opacity: 0.6,
    cursor: 'pointer',
  },
  selectedBox: {
    border: '2px solid #00A0E3',
    borderRadius: '10px',
    padding: '20px',
    opacity: 1,
    cursor: 'pointer',
  },
  totalPrice: {
    padding: '0 20px',
    background: '#E9E9E9',
    marginTop: '50px',
  },
  clearAllBtn: {
    color: '#00A0E3',
    textAlign: 'end',
    padding: '10px 20px',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    width: '40%',
  },
  hideBox: {
    display: 'none',
  },
  boxContainer: {
    padding: '0 15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '118px 1fr',
    gridGap: '22px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '135px 80px',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '287px 1fr',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: '360px 1fr',
    },
  },
  textNormal: {
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  boxSelection: {
    height: '430px',
    [theme.breakpoints.up('md')]: {
      height: '360px',
      margin: 'auto',
    },
    '& .glide__track': {
      overflow: 'visible',
    },
    '& .glide__bullets': {
      display: 'flex',
      justifyContent: 'center',

      '& .glide__bullet': {
        margin: '5px',
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        border: 'none',
        display: 'inline-block',
        backgroundColor: theme.palette.grey[50],
      },
      '& .glide__bullet--active': {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        display: 'inline-block',
        border: 'none',
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
  containerInactive: {
    boxShadow: 'none',
    border: `1px solid ${theme.palette.grey[50]}`,
    backgroundColor: '#FEFEFE',
  },
}));

export { useStylesBoxToBox };
