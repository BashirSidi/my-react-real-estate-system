import React from 'react';
import FormLocation from './FormLocation';
import FormMoveInDate from './FormMoveInDate';
import FormPersonalInfo from './FormPersonalInfo';
import FormSpaceType from './FormSpaceType';

interface IProps {
  currentStep: number;
}

const Forms: React.FC<IProps> = ({ currentStep }) => {
  const step = () => {
    switch (currentStep) {
      case 1:
        return <FormLocation />;
      case 2:
        return <FormSpaceType />;
      case 3:
        return <FormMoveInDate />;
      case 4:
        return <FormPersonalInfo />;
      default:
        return <></>;
    }
  };

  return step();
};

export default Forms;
