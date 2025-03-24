import { StatsigClient, StatsigEvent } from '@statsig/js-client';

const STATSIG_CLIENT_KEY = 'client-RAG7a7fsaQyP3SJysn6CoSHLCCzWMB7UIb6tkJVQVW6';

const Statsig = new StatsigClient(STATSIG_CLIENT_KEY, {
  userID: '6eErEEqJsTZbDBDPK6j4vQ',
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

export const sendEvent = (name: string, event: string, user: string) => {
  Statsig.logEvent({
    eventName: `${name} ${event}`,
    metadata: { name, event, user },
  } as unknown as StatsigEvent);
  Statsig.flush();
};
