const getPolicyLink = (t) => ({
  Singapore:
  {
    links: [
      {
        title: t('link2'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5700062-what-is-our-guest-cancellation-policy',
      },
      {
        title: t('link3'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5525525-termination-policy',
      },
    ],
  },
  Thailand:
  {
    links: [
      {
        title: t('link2'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5714369',
      },
      {
        title: t('link3'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5714369-นโยบายในการยกเลิกสัญญาเช-า',
      },
    ],
  },
  Japan:
  {
    links: [
      {
        title: t('link2'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5700062-what-is-our-guest-cancellation-policy',
      },
      {
        title: t('link3'),
        address: 'https://help-center.spacenextdoor.com/en/articles/5525525-termination-policy',
      },
    ],
  },
});

export const getPolicy = (t, name: string, index: number) => {
  if (!getPolicyLink(t)?.[name]) {
    return null;
  }
  return getPolicyLink(t)?.[name]?.links?.filter((data, i: number) => i !== index);
};
