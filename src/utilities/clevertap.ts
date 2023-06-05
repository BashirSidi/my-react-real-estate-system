import ClevertapReact from 'clevertap-react';
import AuthStore from 'modules/app/stores/AuthStore';

export interface IProfile {
  userId: string | number;
  auth: AuthStore;
  language: string;
  countryName: string;
}

export const identifyUser = (payload: IProfile): void => {
  const {
    auth, language, countryName, userId,
  } = payload;

  return ClevertapReact.profile({
    Site: {
      userId,
      Identity: userId,
      Platform: 'WEB',
      language_upload: language,
      Email: auth?.user?.email ?? '',
      country_upload: countryName,
      Photo: auth?.user?.image_url ?? '',
      Phone: auth?.user?.phone_number ?? '',
      Name: auth?.user?.first_name ?? 'Anonymous',
    },
  });
};
