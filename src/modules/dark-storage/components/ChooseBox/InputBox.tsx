import React from 'react';
import clsx from 'clsx';
import { makeStyles, TextField } from '@material-ui/core';
import Image from '../../../../components/Image';

interface InputBoxProps {
  handleAdd(): void;
  handleRemove(): void;
  onChange(e: any): void;
  value: number;
}

const useStyles = makeStyles(() => ({
  input: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: '10px 0',
  },
  icon: {
    padding: '10px',
    opacity: 1,
    cursor: 'pointer',
  },
  disableIcon: {
    padding: '10px',
    opacity: 0.5,
  },
  inputNumber: {
    width: '30%',
    margin: '20px 0',
  },
  cssOutlinedInput: {
    border: '1px solid #D8D9D8',
    boxSizing: 'border-box',
    fontSize: '30px',
    textAlign: 'center',
    color: '#333333',
    borderRadius: '12px',
  },
  textAlign: {
    textAlign: 'center',
  },
}));

const InputBox: React.FC<InputBoxProps> = (props) => {
  // Constants
  const classes = useStyles();
  const {
    handleAdd,
    handleRemove,
    onChange,
    value,
  } = props;

  return (
    <div className={classes.input}>
      <Image
        className={clsx(classes.icon)}
        name="remove"
        folder="DarkStorage"
        onClick={handleRemove}
      />
      <TextField
        className={classes.inputNumber}
        InputProps={{
          classes: {
            root: classes.cssOutlinedInput,
            input: classes.textAlign,
          },
          inputMode: 'numeric',
        }}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onChange(e.target.value)}
        variant="outlined"
        value={value}
      />
      <Image
        className={clsx(classes.icon)}
        name="add"
        folder="DarkStorage"
        onClick={handleAdd}
      />
    </div>
  );
};

export default InputBox;
