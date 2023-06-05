export const setLocalStorage = (key:string, value:any):void => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const getLocalStorage = (key:string):any => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return undefined;
};

export const removeLocalStorage = (key:string):any => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.removeItem(key);
  }
  return undefined;
};
