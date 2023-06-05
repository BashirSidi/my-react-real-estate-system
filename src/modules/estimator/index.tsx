import React, { useState, useEffect } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import dynamic from 'next/dynamic';

import AuthStore, { AUTH_STORE_KEY } from 'modules/app/stores/AuthStore';
import useTranslation from 'next-translate/useTranslation';
import { useCurrentCountry } from 'utilities/market';
import * as clevertap from 'utilities/clevertap';
import { getCurrentAnonymousUserId } from 'utilities/user';
import Header from './components/Header';
import Categories from './components/Categories';
import FindStorage from './components/FindStorage';
import EstimatorStore, { ESTIMATOR_STORE } from './stores/EstimatorStore';
import { ISpaceType } from '../../shared/interfaces';

const Items = dynamic(() => import('./components/Items'));

interface IProps {
  [ESTIMATOR_STORE]?: EstimatorStore,
  [AUTH_STORE_KEY]?: AuthStore,
}

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: '17px',
    overflow: 'hidden',
  },
}));

const Estimator: React.FC<IProps> = ({
  estimatorStore: { selectedSpaceTypeId, categoryId, itemsDimension },
  auth,
}) => {
  const classes = useStyles();
  const [spaceType, setSpaceType] = useState<ISpaceType>();
  const { lang } = useTranslation();
  const countryName = useCurrentCountry().name;

  useEffect(() => {
    const userId = auth?.user?.id ?? getCurrentAnonymousUserId();
    const payload = {
      auth,
      userId,
      countryName,
      language: lang,
    };
    clevertap.identifyUser(payload);

    // eslint-disable-next-line
  }, []);

  return (
    <Box className={classes.root}>
      <Header />
      <Categories spaceType={spaceType} />
      <Items setSpaceType={setSpaceType} />
      <FindStorage
        spaceType={spaceType}
        categoryId={categoryId}
        spaceTypeId={selectedSpaceTypeId}
        itemsDimension={itemsDimension}
      />
    </Box>
  );
};

export default inject(ESTIMATOR_STORE, AUTH_STORE_KEY)(observer(Estimator));
