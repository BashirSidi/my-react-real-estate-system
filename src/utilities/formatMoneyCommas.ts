const formatMoneyCommas = (n) => (`${n}`).split('').reverse().join('')
  .match(/(\d{1,3})/g)
  .join(',')
  .split('')
  .reverse()
  .join('');
export default formatMoneyCommas;
