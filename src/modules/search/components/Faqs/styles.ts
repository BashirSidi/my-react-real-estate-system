import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 24px 34px',
  },
  wrapper: {
    overflow: 'hidden',
    border: '2px solid rgba(0, 0, 0, .125)',
    borderRadius: 12,
    width: 297,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    '& .MuiAccordion-root .MuiAccordionSummary-root': {
      marginLeft: 15,
      marginRight: 15,
      borderRadius: 0,
      height: 40,
    },
    '&:last-child .MuiAccordion-root': {
      borderBottom: 0,
    },
    '& > div > div': {
      borderBottom: '2px dashed rgba(0, 0, 0, .125)',
    },
    '& > div.Mui-expanded > div': {
      borderBottom: 0,
    },
    '& > :last-child > div': {
      borderBottom: 0,
    },
  },
  headerBox: {
    marginBottom: 25,
  },
  header: {
    fontSize: '1.6rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.35rem',
    },
  },
  question: {
    margin: 0,
    padding: 0,
    lineHeight: 1,
    fontSize: 12,
    fontWeight: 600,
  },
}));
