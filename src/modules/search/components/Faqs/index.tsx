import { memo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useAllPrismicDocumentsByType } from '@prismicio/react';

import useTranslation from 'next-translate/useTranslation';
import { changeToPrismicLang } from 'utilities/prismic';
import { useStyles } from './styles';
import usePageTranslation from '../../../../hooks/usePageTranslation';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

const Faqs: React.FunctionComponent = () => {
  const { lang } = useTranslation();
  const [expanded, setExpanded] = useState<string | boolean>('panel1');
  const [documents] = useAllPrismicDocumentsByType('faq', {
    lang: changeToPrismicLang(lang),
    orderings: ['document.first_publication_date'],
  });

  const classes = useStyles();
  const { t } = usePageTranslation('search', 'Faqs');

  const handleChange = (panel: string) => (
    _event: React.ChangeEvent<HTMLDivElement>,
    newExpanded: boolean,
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  const faqs = (documents || [])
    .map(({ data }) => ({ answer: (data.answer) as string, question: (data.question) as string }));

  return Boolean(faqs.length) && (
    <Box className={classes.root}>
      <Box className={classes.headerBox}>
        <Typography variant="h2" className={classes.header}>
          {t('h2')}
        </Typography>
      </Box>
      <Box className={classes.wrapper}>
        {
          faqs?.map((faq, idx) => (
            <Accordion
              key={faq.question}
              expanded={expanded === `panel${idx + 1}`}
              onChange={handleChange(`panel${idx + 1}`)}
            >
              <AccordionSummary
                aria-controls={`panel${idx + 1}d-content`}
                id={`panel${idx + 1}d-header`}
                expandIcon={<ExpandMoreIcon htmlColor="#EA5B21" />}
              >
                <Typography variant="h6" className={classes.question} title={faq.question}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        }
      </Box>
    </Box>
  );
};

export default memo(Faqs);
