import { Hidden } from '@material-ui/core';
import React from 'react';
import MobileVersion from './MobileVersion';
import DesktopVersion from './DescktopVersion';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setAddress: (address: string) => void;
}

const SearchAddressMap: React.FC<IProps> = (props) => {
  const { isOpen, setIsOpen, setAddress } = props;
  return (
    <>
      <Hidden smUp>
        <MobileVersion
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setAddress={setAddress}
        />
      </Hidden>
      <Hidden xsDown>
        <DesktopVersion
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setAddress={setAddress}
        />
      </Hidden>
    </>
  );
};

export default SearchAddressMap;
