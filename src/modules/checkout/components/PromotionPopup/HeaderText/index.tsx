import { Box } from '@material-ui/core';
import React from 'react';
import Grey3Typography from '../../../../../components/Typographies/Grey3Typography';
import usePageTranslation from '../../../../../hooks/usePageTranslation';

const HeaderText: React.FC = () => {
  const { t } = usePageTranslation('checkout', 'PromotionDialog');
  return (
    <Box>
      <Grey3Typography variant="h3">
        {t('typography1')}
      </Grey3Typography>
    </Box>
  );
};

export default HeaderText;
