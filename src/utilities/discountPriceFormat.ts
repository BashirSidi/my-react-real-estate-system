export const discountedPrice = (priceText: string, discountedAmount: number, local) => {
  const currency = priceText.split(' ')[0];
  const priceData = priceText.split(' ')[1].replace(/,/g, '');
  const numFormatter = new Intl.NumberFormat(local, {
    style: 'decimal',
    maximumFractionDigits: 2,
  });
  if (discountedAmount > 0) {
    return `${currency} ${numFormatter.format((Number(priceData) - discountedAmount))}`;
  }
  return `${currency} ${numFormatter.format((Number(priceData) * 2) / 3)}`;
};
