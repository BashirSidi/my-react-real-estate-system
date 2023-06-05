import { useFlagsmith } from 'flagsmith-react';
import { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import AuthStore from 'modules/app/stores/AuthStore';
import { useCurrentCountry } from 'utilities/market';
import { getUserFlagsmithData } from 'utilities/user';
import { FLAGSMITH_API_KEY } from 'config';
import flagsmith from 'flagsmith';

interface INewVersion {
  auth:AuthStore,
  featureName: string;
  featureValue: string;
}

export const useNewVersion = (payload:INewVersion): boolean => {
  const { lang } = useTranslation();
  const { auth, featureName, featureValue } = payload;
  const countryName = useCurrentCountry().name;
  const {
    identify, getValue, hasFeature, subscribe,
  } = useFlagsmith();
  const [isNewVersion, setIsNewVersion] = useState(false);

  useEffect(() => {
    const { userId, traits } = getUserFlagsmithData(auth, lang, countryName);
    identify(userId, traits);

    // Enable Flagsmith Analytics
    flagsmith.init({
      environmentID: FLAGSMITH_API_KEY,
      enableAnalytics: true,
      onChange: () => {
        if (hasFeature(featureName)) {
          const currentValue = getValue(featureName);
          if (currentValue === featureValue) {
            setIsNewVersion(true);
          }
        }
      },
    });

    // eslint-disable-next-line
  }, []);

  subscribe(() => {
    if (hasFeature(featureName)) {
      const currentValue = getValue(featureName);
      if (currentValue === featureValue) {
        setIsNewVersion(true);
      }
    }
  });

  return isNewVersion;
};
