import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { withStyles } from '@material-ui/core';

export const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: 30,
    padding: 0,
    '&$expanded': {
      minHeight: 2,
      borderRadius: '0 !important',
      borderBottom: 0,
    },
  },
  content: {
    '&$expanded': {
      margin: '9px 0',
      borderBottom: 0,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(8),
    backgroundColor: theme.palette.grey[50],
    borderRadius: '0 0 10px 10px',
  },
}))(MuiAccordionDetails);
