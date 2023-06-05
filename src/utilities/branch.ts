/* eslint-disable no-console */
declare const window: any;
export const track = (event: string, data: any): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  window && window.branch
    && window.branch.logEvent
    && window.branch.logEvent(
      event,
      data, (error) => error && console.error(
        `Something went wrong while sending Branch Custom event: ${event}`,
        error,
      ),
    );
};
