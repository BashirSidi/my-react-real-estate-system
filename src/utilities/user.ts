import { APP_ENV } from 'config';
import AuthStore from 'modules/app/stores/AuthStore';

interface IUserTraitsResp { userId:string, traits: any }

// Generate a random based on the maximum provided number
const getRandomNumber = (max: number): number => Math.ceil(Math.random() * max);

// Generate current anonymous userId based on the environment
export const getCurrentAnonymousUserId = (): string => {
  const date = new Date();
  const data = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
    getRandomNumber(999999999),
  ];

  const pattern = `(${APP_ENV}_\\d+)`;
  const regex = new RegExp(pattern);
  const x = document.cookie;

  // Check if we've current user in cookies
  if (regex.test(x)) return x.match(regex)?.[0];

  // Generate new userId based on env and create cookie
  const id = `${APP_ENV}_${data.join('')}`;
  document.cookie = id;
  return id;
};

export const getUserFlagsmithData = (
  auth:AuthStore,
  language: string,
  countryName: string,
): IUserTraitsResp => {
  const userId = auth?.user?.id
    ? `${APP_ENV}_${auth?.user?.id}`
    : getCurrentAnonymousUserId();

  const traits = {
    language,
    user_id: userId,
    country: countryName,
    phone: auth?.user?.phone_number ?? '',
    email: auth?.user?.email ?? '',
  } as any;

  return { userId, traits };
};
