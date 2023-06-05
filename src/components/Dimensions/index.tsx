import { makeStyles } from '@material-ui/core';
import React from 'react';

interface IProps {
  width: number;
  height: number;
  length: number;
  unit: string;
  style?: any;
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: 300,
    color: theme.palette.grey[300],
    fontSize: '1rem',
    paddingLeft: '5px',
  },
}));

const Dimensions: React.FC<IProps> = ({
  width, height, length, unit, style,
}) => {
  const HEIGHT_CHARACTER = '(H)';
  const classes = useStyles();
  const fullSizeSring = () => (
    height > 0 ? (
      <>
        <span>{width}</span>
        { unit }
        { ' ' }
        x
        { ' ' }
        <span>{length}</span>
        {unit}
        { ' ' }
        x
        { ' ' }
        <span>{height}</span>
        { unit }
        { ` ${HEIGHT_CHARACTER} ` }
      </>
    ) : (
      <>
        <span>{width}</span>
        {unit}
        {' '}
        x
        {' '}
        <span>{length}</span>
        {unit}
        { ' ' }
      </>
    )
  );

  return (
    <span className={style || classes.heading}>{fullSizeSring()}</span>
  );
};

export default Dimensions;
