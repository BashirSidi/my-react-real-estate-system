import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Theme,
  Hidden,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import _ from 'lodash';
import { NAME_SIZE_L, NAME_SIZE_M } from 'utilities/boxToBox';
import { GET_DARK_STORAGE_QUERY } from 'modules/home/components/DarkStorage/Boxes/queries';
import { BOX_TO_BOX } from 'config';
import {
  getDarkStorageQuery,
  getDarkStorageQueryVariables,
} from 'modules/home/components/DarkStorage/Boxes/queries/__generated__/getDarkStorageQuery';
import { SiteStatus } from 'typings/graphql.types';
import Header from '../Header';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import Image from '../../../../components/Image';
import InputBox from './InputBox';
import { BOX_TO_BOX_ADDRESS_KEY } from '../../../checkout/stores/BookingStore';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from '../../../../utilities/localStorage';
import { useStylesBoxToBox } from './boxToBoxStyle';
import * as Carousel from '../../../../components/Carousel';
import BoxContainer from './BoxContainer';

interface IProps {
  setSpaceId: (id: number) => void;
}

const ChooseBox: React.FC<IProps> = ({ setSpaceId }) => {
  // Constants
  const classes = useStylesBoxToBox();
  const { t } = usePageTranslation('darkStorage', 'Details');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const pickUpData = getLocalStorage(BOX_TO_BOX_ADDRESS_KEY);
  const { data } = useQuery<getDarkStorageQuery, getDarkStorageQueryVariables>(
    GET_DARK_STORAGE_QUERY,
    {
      variables: {
        where: {
          name: { _iLike: BOX_TO_BOX },
          status: { _eq: SiteStatus.INACTIVE },
        },
        pagination: { limit: 1, skip: 0 },
        spacesLimit: 20,
      },
    },
  );
  const darkStorageSpaces = data?.sites?.edges[0]?.spaces?.edges;

  // States
  const [boxesDetail, setBoxesDetail] = useState({ unit: 0 });
  const [isSelectedMedium, setIsSelectedMedium] = useState<boolean>(true);
  const carouselOptions = {
    startAt: isSelectedMedium ? 0 : 1,
    type: 'slider',
    perView: 1,
    breakpoints: {
      600: {
        gap: 10,
        peek: { before: 50, after: 90 },
      },
      375: {
        gap: 10,
        peek: { before: 40, after: 50 },
      },
    },
    perTouch: 1,
  };

  useEffect(() => {
    if (boxesDetail.unit === 0) {
      removeLocalStorage(BOX_TO_BOX_ADDRESS_KEY);
    }
  }, [boxesDetail.unit]);

  // Functions
  const getBoxDetail = (name: string) => darkStorageSpaces?.filter((box) => box.name === name);

  const onChange = (isMediumBox: boolean, unit: number) => {
    if (unit >= 0 && unit <= 10) {
      const detail = getBoxDetail(
        `${isMediumBox ? NAME_SIZE_M : NAME_SIZE_L}${unit}`,
      )[0];
      const spaceId = _.get(detail, 'id');
      if (spaceId) setSpaceId(spaceId);

      setLocalStorage(
        BOX_TO_BOX_ADDRESS_KEY,
        JSON.stringify({
          ...JSON.parse(pickUpData),
          price: _.get(detail, 'prices[0].price_per_month'),
        }),
      );
      setBoxesDetail({ ...boxesDetail, ...detail, ...{ unit } });
    }
  };
  const onSelectedBox = (isMedium: boolean) => {
    setIsSelectedMedium(isMedium);
    setBoxesDetail({ unit: 0 });
  };

  return (
    <Box className={classes.root}>
      <Header content="ChooseBox" />
      <Grid container spacing={2}>
        <Grid
          container
          md={7}
          xs={12}
          className={isMobile ? '' : classes.container}
        >
          <Hidden smUp>
            <>
              <Carousel.Component options={carouselOptions}>
                <Carousel.Slide key={1}>
                  <Box className={classes.container}>
                    <BoxContainer
                      isMedium
                      isSelected={isSelectedMedium === true}
                      onClick={() => onSelectedBox(true)}
                      isSelectedMedium={isSelectedMedium}
                      onChange={onChange}
                      unit={boxesDetail.unit}
                    />
                  </Box>
                </Carousel.Slide>
                <Carousel.Slide key={2}>
                  <Box className={classes.container}>
                    <BoxContainer
                      isMedium={false}
                      isSelected={isSelectedMedium === false}
                      onClick={() => onSelectedBox(false)}
                      isSelectedMedium={isSelectedMedium}
                      onChange={onChange}
                      unit={boxesDetail.unit}
                    />
                  </Box>
                </Carousel.Slide>
              </Carousel.Component>
              <Grid justify="center">
                <InputBox
                  handleAdd={() => onChange(isSelectedMedium, boxesDetail.unit + 1)}
                  handleRemove={() => onChange(isSelectedMedium, boxesDetail.unit - 1)}
                  value={boxesDetail.unit}
                  onChange={(e) => {
                    onChange(isSelectedMedium, Number(e));
                  }}
                />
                <Typography align="center">{t('maximumBoxes')}</Typography>
              </Grid>
            </>
          </Hidden>
          <Hidden only="xs">
            <Grid md={6} className={classes.boxContainer}>
              <BoxContainer
                isMedium
                isSelected={isSelectedMedium === true}
                onClick={() => onSelectedBox(true)}
                isSelectedMedium={isSelectedMedium}
                onChange={onChange}
                unit={boxesDetail.unit}
              />
            </Grid>
            <Grid md={6} className={classes.boxContainer}>
              <BoxContainer
                isMedium={false}
                isSelected={isSelectedMedium === false}
                onClick={() => onSelectedBox(false)}
                isSelectedMedium={isSelectedMedium}
                onChange={onChange}
                unit={boxesDetail.unit}
              />
            </Grid>
          </Hidden>
        </Grid>

        <Grid md={5} className={clsx(classes.container)}>
          <div style={{ border: '2px solid #E9E9E9', borderRadius: '10px' }}>
            <div className={classes.column}>
              <Typography
                style={{ width: '60%' }}
                className={clsx(classes.textNormal, classes.textPriceDetail)}
              >
                {t('list_of_box')}
              </Typography>
              <Button
                type="button"
                className={classes.clearAllBtn}
                onClick={() => setBoxesDetail({ unit: 0 })}
              >
                {t('clear_all')}
              </Button>
            </div>
            {boxesDetail.unit > 0 && (
              <div
                className={clsx(classes.textNormal, classes.textPriceDetail, {
                  hideBox: isSelectedMedium,
                })}
              >
                <Typography className={classes.boxTitle}>
                  {isSelectedMedium ? t('medium') : t('large')}
                </Typography>
                <Typography className={classes.boxUnit}>
                  {`x ${boxesDetail.unit}`}
                </Typography>
                <Typography className={classes.boxPrice}>
                  {`${_.get(boxesDetail, 'prices[0].currency_sign')}
                  ${_.get(boxesDetail, 'prices[0].price_per_month')}`}
                </Typography>
              </div>
            )}
            <div className={clsx(classes.column, classes.totalPrice)}>
              <div className={classes.textTotal}>
                <Typography style={{ fontWeight: 600 }}>
                  {t('total')}
                </Typography>
                <Typography style={{ margin: '0 10px' }}>
                  {t('monthly_price')}
                </Typography>
              </div>
              <Typography
                className={
                  boxesDetail.unit ? classes.textTotalPrice : classes.hide
                }
              >
                {`${_.get(boxesDetail, 'prices[0].currency_sign')}
                  ${_.get(boxesDetail, 'prices[0].price_per_month')}`}
              </Typography>
            </div>
          </div>

          <div className={classes.card}>
            <Image
              className={classes.infoIcon}
              name="info"
              folder="DarkStorage"
            />
            <div>
              <Typography className={classes.secondary}>
                {t('sendTheBoxesToYourAddress')}
              </Typography>
              <Typography className={classes.bold}>
                {t('dayOfPickupDate')}
              </Typography>
              <Typography>{t('contentPleaseNote')}</Typography>
              <Typography className={classes.textSmall}>
                {t('youMustSecure')}
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChooseBox;
