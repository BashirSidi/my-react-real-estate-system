import * as prismic from '@prismicio/client';
import { PRISMIC_ACCESS_TOKEN } from 'config';

export const repositoryName = 'spacenextdoor';
const endpoint = prismic.getEndpoint(repositoryName);

export const client = prismic.createClient(endpoint, {
  accessToken: PRISMIC_ACCESS_TOKEN,
});

export const changeToPrismicLang = (lang: string):string => {
  if (lang.includes('ja') || lang.includes('jp')) return 'ja-jp';
  if (lang.includes('th')) return 'th';

  return 'en-us';
};
