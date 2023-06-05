import {
  Box, makeStyles, Popover, Typography,
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { useRouter } from 'next/router';
import * as React from 'react';
import { capitalizeFirstLetter } from 'utilities/capitalizeFirstLetter';
import { getTranslatedName } from 'utilities/market';
import Image from '../../../../../components/Image';

interface IProps {
  item: {
    id: number;
    name_en: string;
    description_en: string;
  };
  className?: string;
  showPromoName?: boolean;
  showCheckedIcon?: boolean;
  darkText?: boolean;
  setCheckedPromo?: any;
}

const useStyles = makeStyles((theme) => ({
  promotionDarkText: {
    fontSize: '10px',
    display: 'flex',
    marginTop: '5px',
    paddingBottom: '4px',
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    height: '27px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
    },
    cursor: 'pointer',
  },
  check: {
    marginLeft: '1rem',
    marginTop: '0,2rem',
    color: theme.palette.success.main,
  },
  infoIcon: {
    marginLeft: '6px',
    marginTop: '3px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  popoverTextGroup: {
    display: 'flex',
  },
  popoverText: {
    fontSize: '1rem',
    marginLeft: '1.5rem',
    paddingTop: '0.5rem',
    marginRight: '0.5rem',
    maxWidth: '200px',
  },
  boxImage: {
    display: 'flex',
    alignItems: 'flex-start',
    cursor: 'pointer',
  },
  imageClose: {
    marginTop: '0.5rem',
    marginRight: '0.5rem',
    width: '15px',
  },
}));

const PopoverInfo: React.FC<IProps> = ({
  item, showPromoName = false,
  showCheckedIcon = false, setCheckedPromo = null,
}) => {
  const { locale } = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget?.childNodes[0]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Box className={classes.promotionDarkText}>
        <Box onClick={() => setCheckedPromo(item.id)}>{showPromoName && capitalizeFirstLetter(getTranslatedName(item, 'name', locale))}</Box>
        <Box onClick={handleClick}>
          <Image className={classes.infoIcon} name="info" folder="DetailPage" />
        </Box>
        <Popover
          id={item.id.toString()}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box className={classes.popoverTextGroup}>
            <Typography className={classes.popoverText}>
              {capitalizeFirstLetter(getTranslatedName(item, 'description', locale))}
            </Typography>
            <Box onClick={handleClose} className={classes.boxImage}>
              <Image className={classes.imageClose} onClick={handleClose} name="close" />
            </Box>
          </Box>
        </Popover>
        {showCheckedIcon && <Check className={classes.check} />}
      </Box>
    </Box>
  );
};

export default PopoverInfo;
