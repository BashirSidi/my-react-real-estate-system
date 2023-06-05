import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: '28px 24px 34px',
    position: 'relative',
  },
  headerBox: {
    marginBottom: 16,
    marginLeft: 7,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  header: {
    fontSize: '1.6rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.35rem',
    },
  },
  question: {
    fontWeight: 600,
  },
  playerWrapper: {
    width: 298.91,
    height: 169,
    marginLeft: 7,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      marginLeft: 0,
    },
  },
  reactPlayer: {
    position: 'relative',
    '& iframe, & video': {
      borderRadius: 8,
    },
  },
  dialog: {
    borderRadius: 10,
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgb(0,0,0)',
    },
    '& .MuiDialog-paperFullWidth': {
      borderRadius: 15,
    },
    '& .MuiDialogContent-root': {
      padding: 0,
    },
  },
  playerControls: {
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'visibility 0s linear 0.3s, opacity 0.3s',
  },
  playerControlsButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 50,
    height: 50,
    minWidth: 50,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    '& svg': {
      fontSize: '3rem',
      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  loader: {
    color: theme.palette.background.default,
  },
  closeIcon: {
    fontSize: '3rem',
    cursor: 'pointer',
  },
  closeWrapper: {
    position: 'absolute',
    top: 60,
    right: '5%',
    zIndex: 5000000,
  },
}));
