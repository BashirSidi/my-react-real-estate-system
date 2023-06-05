import React from 'react';
import {
  Typography, Grid, useMediaQuery, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import InputBox from './InputBox';
import { useStylesBoxToBox } from './boxToBoxStyle';
import Image from '../../../../components/Image';
import usePageTranslation from '../../../../hooks/usePageTranslation';

interface IProps {
  isMedium: boolean;
  isSelected?: boolean;
  onClick?(): void;
  isSelectedMedium: boolean;
  onChange(isSelected: boolean, unit: number): void;
  unit: number;
}

const BoxContainer: React.FC<IProps> = (props) => {
  // Constants
  const classes = useStylesBoxToBox();
  const { t } = usePageTranslation('darkStorage', 'Details');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const {
    isMedium,
    isSelected,
    onClick,
    isSelectedMedium,
    onChange,
    unit,
  } = props;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={clsx({
          [classes.selectedBox]: isSelected,
          [classes.listBox]: true,
        })}
        onClick={onClick ? () => onClick() : undefined}
      >
        <Typography className={classes.title}>
          {t(`${isMedium ? 'medium' : 'large'}_title`)}
        </Typography>
        <Typography className={clsx(classes.textNormal, classes.gray)}>
          {t(`${isMedium ? 'medium' : 'large'}_size`)}
        </Typography>
        <Image
          className={classes.img}
          name={`box-${isMedium ? 'm' : 'l'}-dimension`}
          folder="DarkStorage"
          extension="jpg"
        />
        <Grid container>
          <Typography className={clsx([classes.primary, { margin: '0 10px' }])}>
            {t(`${isMedium ? 'medium' : 'large'}_price`)}
          </Typography>
          <Typography className={classes.textSecond}>{t('unit')}</Typography>
        </Grid>
      </div>
      {!isMobile && isSelected && (
        <>
          <InputBox
            handleAdd={() => onChange(isSelectedMedium, unit + 1)}
            handleRemove={() => {
              onChange(isSelectedMedium, unit - 1);
            }}
            value={unit}
            onChange={(e) => {
              onChange(isSelectedMedium, Number(e));
            }}
          />
          <Typography align="center">{t('maximumBoxes')}</Typography>
        </>
      )}
    </>
  );
};

export default BoxContainer;
