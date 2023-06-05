import {
  Box, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '10px',
    position: 'absolute',
    zIndex: 5,
    width: '250px',
    overflow: 'hidden',
    boxShadow: '0px 15px 40px rgb(51 51 51 / 10%)',
  },
  details: {
    background: '#494949',
    color: '#FFF',
    fontSize: '1.195rem',
    display: 'block',
    padding: '15px',
    lineHeight: '1.6em',
    width: '100%',
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%',
    display: 'block',
  },
  display: {
    display: 'none',
  },
}));

interface IProps {
  url: string;
  details: string;
  className?: string;
}

const SpaceTypeDetails: React.FC<IProps> = ({
  url, details, className,
}) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)}>
      <Box>
        <img className={classes.img} src={url} alt="gif" />
      </Box>
      <Typography className={classes.details}>
        {details}
      </Typography>
    </Box>
  );
};

export default SpaceTypeDetails;
