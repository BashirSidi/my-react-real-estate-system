import { Dialog, makeStyles } from '@material-ui/core';
import Image from 'components/Image';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100vw',
    maxWidth: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    background: 'transparent',
    margin: '0 !important',
    [theme.breakpoints.down('sm')]: {
      height: '100%',
      maxHeight: '100%',
    },
  },
  frame: {
    border: 'none',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  close: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    top: '30px',
    right: '30px',
    zIndex: 1000,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      top: '17px',
      right: '20px',
      width: '15px',
      height: '24px',
    },
  },
}));

interface IProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  url3d: string;
}

const Model3D: React.FC<IProps> = ({ isOpen, setIsOpen, url3d }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      classes={{ paperWidthSm: classes.paper }}
    >
      <iframe
        src={url3d}
        allow="fullscreen; vr"
        id="showcase-iframe"
        className={classes.frame}
        title="virtual-view"
      />
      <Image folder="DetailPage" name="close" className={classes.close} onClick={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default Model3D;
