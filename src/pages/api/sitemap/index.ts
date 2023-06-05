import { createGzip } from 'zlib';
import { SitemapStream } from 'sitemap';
import { getCountry } from 'utilities/market';
import { IESResponse, ISearchbody } from 'pages/api/es';
import { Client } from '@elastic/elasticsearch';
import domainConfigs from '../../../../domain.config.json';

const ELASTIC_SEARCH_URL = process.env.REACT_APP_ELASTIC_SEARCH_URL;
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';

export const getActiveSites = async (countryId: number) => {
  const params = {
    query: {
      bool: {
        must: [
          {
            match: {
              status: 'ACTIVE',
            },
          },
          {
            match: {
              'address.country_id': countryId,
            },
          },
        ],
      },
    },
    fields: ['id'],
    // eslint-disable-next-line
    _source: [],
    from: 0,
    size: 10000,
    sort: [],
  };

  const client = new Client({
    node: ELASTIC_SEARCH_URL,
  });

  const response = await client.search<IESResponse, ISearchbody>({
    body: params,
  });
  return response.body.hits.hits.map((site) => site.fields?.id[0]);
};

export const domainsByEnv = () => {
  const domains = domainConfigs[process.env.APP_ENV];
  if (!domains || domains.length < 1) {
    return [
      {
        domain: 'localhost:3000',
        defaultLocale: DEFAULT_LOCALE,
        locales: [`${DEFAULT_LOCALE}`],
        enable: true,
        http: true,
      },
    ];
  }
  return domains;
};
const STATIC_URLS = [
  '/',
  '/checkout',
  '/checkout/confirmation',
  '/customer/account',
  '/customer/bookings',
  '/host',
  '/host-onboarding',
  '/estimator-box',
  '/estimator',
  '/get-a-quote',
  '/landing',
  '/login',
  '/place',
  '/profile',
  '/search',
];

const getDynamicUrls = async (countryId: number, currentDomain: string) => {
  const dynamicUrls = [];
  const siteIds = await getActiveSites(countryId);
  siteIds.forEach((id) => dynamicUrls.push(`${currentDomain}/details/${id}`));
  return dynamicUrls;
};

export default async (req, res) => {
  // eslint-disable-next-line
  const { __nextDefaultLocale } = req.query;
  // eslint-disable-next-line
  const { id } = getCountry(__nextDefaultLocale);
  const isHttp = domainsByEnv()[0].http;
  const { domain } = domainsByEnv()[0];
  const currentDomain = `http${isHttp ? '' : 's'}://${domain}`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Encoding', 'gzip');

  const sitemapStream = new SitemapStream();
  const pipeline = sitemapStream.pipe(createGzip());
  const DYNAMIC_URLS = await getDynamicUrls(id, currentDomain);

  STATIC_URLS.map((url) => `${currentDomain}${url}`).forEach((url) => {
    sitemapStream.write({ url });
  });

  DYNAMIC_URLS.forEach((url) => {
    sitemapStream.write({ url });
  });
  sitemapStream.end();

  pipeline.pipe(res).on('error', (err) => {
    throw err;
  });
};
