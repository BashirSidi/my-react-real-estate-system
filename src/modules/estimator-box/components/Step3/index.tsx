import React, { FC } from 'react';
import {
  Box, Typography, Grid, Link, Hidden,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import clsx from 'clsx';

import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import ClevertapReact from 'clevertap-react';
import useTranslation from 'next-translate/useTranslation';
import { logErrorCleverTap } from 'utilities/catchErrorCleverTap';
import { useCurrentCountry } from 'utilities/market';
import { ITrackingEstimator } from 'shared/interfaces';
import IEventName from 'shared/event-name.enum';
import * as gtag from 'utilities/gtag';
import * as intercom from 'utilities/intercom';
import useStyles from '../Step2/step2.style';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import RecommendedStorage from '../RecommendedStorage';
import FindStorage from '../FindStorage';
import EstimatorBoxStore, { ESTIMATOR_BOX_STORE } from '../../stores/EstimatorBoxStore';
import { PrimaryButton, TextButton } from '../../../../components/Buttons';
import AuthStore, { AUTH_STORE_KEY } from '../../../app/stores/AuthStore';
import { GetSpaceType, GetSpaceTypeVariables } from '../../../estimator/queries/__generated__/GetSpaceType';
import { GET_SPACE_TYPE } from '../../../estimator/queries';

interface IProps {
  [ESTIMATOR_BOX_STORE]?: EstimatorBoxStore,
  [AUTH_STORE_KEY]?: AuthStore;
}

const Step3: FC<IProps> = ({
  estimatorBoxStore: {
    boxCount,
    isStandardBox,
    selectedSpaceTypeId,
    itemsDimension,
    incrementCurrentStep,
    setSpaceTypeId,
    setCurrentCountry,
  },
  auth,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { lang } = useTranslation();
  const country = useCurrentCountry()?.name;
  const { t } = usePageTranslation('estimatorBox', 'Step3');
  setCurrentCountry(country);

  const { loading, data } = useQuery<GetSpaceType, GetSpaceTypeVariables>(
    GET_SPACE_TYPE,
    {
      variables: {
        size: parseInt(String(itemsDimension), 10),
        country,
      },
    },
  );

  const spaceType = data?.space_types?.edges.length ? data?.space_types?.edges[0] : null;

  const triggerFindStorageEvent = () => {
    try {
      const trackingPayload: ITrackingEstimator = {
        customerEmail: auth?.user?.email,
        customerPhone: auth?.user?.phone_number,
        customerName: `${auth?.user?.first_name}`,
        language: lang,
        country,
        platform: 'WEB',
        districtName: '',
        city: '',
        boxType: isStandardBox ? 'Standard' : 'Custom',
        boxSize: itemsDimension,
        totalBoxes: boxCount,
        recommendedPlan: spaceType?.id,
      };
      const eventName = IEventName.FIND_STORAGE_CLICKED;
      gtag.track(eventName, trackingPayload);
      intercom.track(eventName, trackingPayload);
      ClevertapReact.event(eventName, trackingPayload);
    } catch (errEvent) {
      logErrorCleverTap(IEventName.FIND_STORAGE_CLICKED, errEvent);
    }
  };

  return (
    <Grid item className={classes.container}>
      <Box className={classes.header}>
        <Typography className={classes.blockTitle}>
          {t('typography1')}
        </Typography>
      </Box>
      <Box className={classes.boxSelectionFlex}>
        <Box className={classes.boxCounterResult}>
          <Box>
            <Image className={classes.boxImageSmall} name="boxes" folder="Estimator/Box" />
          </Box>
          <Box className={classes.boxCounterColumn}>
            <Typography
              variant="h3"
              className={clsx(
                classes.counterNumber,
                boxCount > 999 && classes.counterNumberSmall,
              )}
            >
              {boxCount}
            </Typography>
            <Typography variant="h3" className={classes.boxLabel}>{isStandardBox ? t('typography2') : t('typography3')}</Typography>
          </Box>
        </Box>

        <Box className={classes.recommendedContainer}>
          <RecommendedStorage
            loading={loading}
            spaceType={spaceType}
            setSpaceTypeId={setSpaceTypeId}
          />
        </Box>
      </Box>
      <Hidden smUp>
        <FindStorage spaceTypeId={selectedSpaceTypeId} />
      </Hidden>
      <Hidden only="xs">
        <Grid container justify="space-between" className={classes.button}>
          <Grid item>
            <TextButton
              className="textBack"
              onClick={() => incrementCurrentStep(-1)}
            >
              {t('button1')}
            </TextButton>
          </Grid>
          <Grid item>
            <Link
              color="inherit"
              className={classes.link}
              href={`/${router.locale}/search?space_type=${selectedSpaceTypeId}`}
            >
              <PrimaryButton
                className="textWhite btnFindStorage"
                onClick={triggerFindStorageEvent}
              >
                {t('button2')}
              </PrimaryButton>
            </Link>
          </Grid>
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default inject(ESTIMATOR_BOX_STORE, AUTH_STORE_KEY)(observer(Step3));
