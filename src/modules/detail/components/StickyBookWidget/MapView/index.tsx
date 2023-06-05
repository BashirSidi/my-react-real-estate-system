import {
  Box, Button, makeStyles,
} from '@material-ui/core';
import usePageTranslation from 'hooks/usePageTranslation';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: '2rem',
    padding: '0.2rem',
    cursor: 'pointer',
    maxWidth: '350px',
    margin: '2rem',
    marginLeft: '5.8rem',
  },
  image: {
    borderRadius: '15px',
    width: '100%',
    height: '165px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    color: 'white',
    cursor: 'pointer',
    left: '26.5%',
    height: '50px',
    width: '47%',
    minWidth: 'max-content',
    fontSize: '13px',
    transition: 'background 0.5s ease',
    fontWeight: 700,
    '&:hover': {
      background: '#016e9c',
    },
  },
}));

interface IProps {
  setShowMap: (showMap: boolean) => void;

}

const MapView: React.FC<IProps> = ({ setShowMap }) => {
  const classes = useStyles();
  const { t } = usePageTranslation('search', 'ViewOnMap');
  return (
    <Box className={classes.root} onClick={() => setShowMap(true)}>
      <div
        className={classes.image}
        style={{ backgroundImage: 'URL("https://static.spacenextdoor.com/icons/defaultMap.svg")' }}
      >
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
        >
          {t('button')}
        </Button>
      </div>
    </Box>
  );
};

export default MapView;
