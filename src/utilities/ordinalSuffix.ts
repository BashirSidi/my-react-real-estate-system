export const ordinalSuffix = (number: number) : string => {
  const i = number % 10;
  const j = number % 100;
  if (i === 1 && j !== 11) {
    return `${number}st`;
  }
  if (i === 2 && j !== 12) {
    return `${number}nd`;
  }
  if (i === 3 && j !== 13) {
    return `${number}rd`;
  }
  return `${number}th`;
};
