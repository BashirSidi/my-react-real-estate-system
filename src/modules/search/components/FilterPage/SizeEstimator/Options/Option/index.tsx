import {
  Box, fade, Grid, Hidden, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { getResizedURL } from 'utilities/imageResizer';
import { getTranslatedSizeUnit } from 'utilities/market';
import usePageTranslation from '../../../../../../../hooks/usePageTranslation';
import SpaceTypeDetails from '../../../../../../../components/SpaceTypeDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${fade(theme.palette.primary.main, 0.5)}`,
    borderRadius: '14px',
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      background: 'white',
      border: `2px solid ${theme.palette.grey[50]}`,
      padding: '9px 30px',
    },
    maxWidth: '300px',
    '& img:hover + div': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      display: 'block',
    },
  },
  rootActive: {
    backgroundColor: theme.palette.primary.main,
    '& $title': {
      color: '#FFFFFF',
    },
    '& $description': {
      color: '#FFFFFF',
    },
    [theme.breakpoints.up('sm')]: {
      background: 'white',
      padding: '13px 30px',
      boxShadow: '0px 15px 40px rgba(51, 51, 51, 0.1)',
      border: `1px solid ${theme.palette.primary.main} !important`,
      '& $title': {
        color: theme.palette.primary.main,
      },
      '& $description': {
        color: theme.palette.primary.main,
      },
    },
  },
  tooltip: {
    display: 'none',
  },
  titleBox: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '6px',
  },
  title: {
    color: fade(theme.palette.primary.main, 0.5),
    fontWeight: 700,
    [theme.breakpoints.up('sm')]: {
      color: theme.palette.grey[100],
      fontSize: theme.typography.h4.fontSize,
    },
  },
  descriptionBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  description: {
    color: fade(theme.palette.primary.main, 0.5),
    fontSize: '10px',
    [theme.breakpoints.up('sm')]: {
      color: theme.palette.grey[100],
      fontSize: '1.4rem',
    },
  },
  icon: {
    width: '85px',
    height: '85px',
  },
}));

interface IProps {
  id: number;
  title: string;
  description: string;
  unit: string;
  icon: string;
  gif: string;
  range_start: number;
  range_end: number;
  is_locker: boolean;
  isSelected: boolean;
  onSelect(id: number): void;
  htmlId: string;
}

const Option: React.FC<IProps> = ({
  title, description, unit, range_end, is_locker, range_start, onSelect, icon, id,
  isSelected, gif, htmlId,
}) => {
  const classes = useStyles();
  const { locale } = useRouter();
  const { t } = usePageTranslation('search', 'SpaceTypes');
  const sizeRange = `${range_start} - ${range_end}`;
  return (
    <Box
      className={clsx(classes.root, isSelected && classes.rootActive)}
      onClick={() => onSelect(id)}
      id={htmlId}
    >

      <Grid container alignItems="center">
        <Hidden only="xs">
          <Grid item sm={5} lg={5} xl={5}>
            <Box>
              <img className={classes.icon} src={getResizedURL(icon, { width: 85 })} alt={title} loading="lazy" />
              <SpaceTypeDetails
                className={classes.tooltip}
                details={description}
                url={gif}
              />
            </Box>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={7} lg={7} xl={7}>
          <Box className={classes.titleBox}>
            <Typography className={classes.title}>
              {title}
            </Typography>
          </Box>
          <Box className={classes.descriptionBox}>
            <Typography className={classes.description}>
              {
                is_locker && t('locker')
              }
              {!is_locker && sizeRange}
              &nbsp;
              { !is_locker && getTranslatedSizeUnit(unit, locale)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Option;
