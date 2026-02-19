import { StatsigClient, StatsigEvent } from '@statsig/js-client';

const STATSIG_CLIENT_KEY = import.meta.env.VITE_STATSIG_CLIENT_KEY;

const Statsig = new StatsigClient(STATSIG_CLIENT_KEY, {
  userID: import.meta.env.VITE_STATSIG_USER_ID,
});

Statsig.initializeAsync();

export const fetchNames = (): string[] => {
  const config = Statsig.getDynamicConfig('names');
  return (config.get('names') || []) as string[];
};

export const fetchItems = (name: string): string[] => {
  const config = Statsig.getDynamicConfig('events');
  return (config.get(name) || []) as string[];
};

export const sendEvent = (name: string, event: string, user: string, comment:string|null) => {
  Statsig.logEvent({
    eventName: `${name} ${event}`,
    metadata: { name, event, user, comment },
  } as unknown as StatsigEvent);
  Statsig.flush();
};
