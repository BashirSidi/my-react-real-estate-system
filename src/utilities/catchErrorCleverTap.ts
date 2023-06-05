import IEventName from 'shared/event-name.enum';

export const logErrorCleverTap = (eventName: IEventName, errEvent: any): void => {
  console.error(`EVENT_ERROR_AFTER_${eventName.toUpperCase()}`, errEvent);
};
