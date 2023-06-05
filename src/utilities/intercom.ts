/* eslint-disable no-console */
declare const window: any;
export const track = (event: string, data: any): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  window?.Intercom('trackEvent', event, data);
};
