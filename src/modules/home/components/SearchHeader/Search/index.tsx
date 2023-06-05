import { Box, makeStyles } from '@material-ui/core';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Store, STORE_KEY } from 'modules/app/stores/Store';
import { useEffect } from 'react';
import { useCurrentCountry } from 'utilities/market';
import SearchInput from '../../../../../components/Search/SearchInput';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      position: 'initial',
      maxHeight: '50px',
      marginBottom: '15px',
      '& div': {
        margin: '0',
      },
    },
  },
  input: {
    fontSize: '12px',
    lineHeight: '20px',
    [theme.breakpoints.up('md')]: {
      fontSize: '20px',
      lineHeight: '30px',
    },
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    left: '12px',
    top: '12px',
    [theme.breakpoints.up('md')]: {
      left: '17px',
      top: '17px',
    },
  },
}));

interface IProps {
  [STORE_KEY]?: Store
}

const Search: React.FC<IProps> = ({ esStore }) => {
  const classes = useStyles();
  const { locations, populateData } = esStore;
  const country = useCurrentCountry();

  useEffect(() => {
    if (!locations.length) {
      populateData(country.id);
    }
  }, []);

  return (
    <Box className={classes.root}>
      <SearchInput theme="light" />
    </Box>
  );
};

export default inject(STORE_KEY)(observer(Search));
