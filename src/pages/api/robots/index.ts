import { domainsByEnv } from '../sitemap';

const getRobotsContent = (defaultLocale: string, domain: string) => ([
  'User-agent: *',
  'Disallow: /api/*',
  `allow: /${defaultLocale}/*`,
  `SiteMap: ${domain}/sitemap.xml`,
].join('\n'));

export default async (req, res) => {
  // eslint-disable-next-line
  const { __nextDefaultLocale } = req.query;
  // eslint-disable-next-line
  const isHttp = domainsByEnv()[0].http;
  const { domain } = domainsByEnv()[0];
  const currentDomain = `http${isHttp ? '' : 's'}://${domain}`;
  const robotsContent = getRobotsContent(__nextDefaultLocale, currentDomain);
  res.send(robotsContent);
};
