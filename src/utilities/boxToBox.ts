export const NAME_SIZE_M = 'Box M x';
export const NAME_SIZE_L = 'Box L x';
export const BOX_M = 'M';
export const BOX_L = 'L';
export const INDEX_OF_BOX_NAME = 7;

export const getNameOfBox = (name: string): string => {
  if (name === NAME_SIZE_M) return BOX_M;
  return BOX_L;
};
