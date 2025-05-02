import { invokeUrl } from './constants';
import { AwsNamedEvent, AwsName } from './types';

export const createNamedEvent = async (
  name: string,
  namedEvent: string,
  user: string,
) => {
  const response = await fetch(`${invokeUrl}config/event`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify({ name, event: namedEvent }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Event created in API gateway');
  }
  return response.json();
};

export const fetchEvents = async (user: string, name: string) => {
  const escapedName = encodeURIComponent(name);
  const response = await fetch(`${invokeUrl}config/event/${escapedName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Events fetched from API gateway');
  }
  return response.json();
};

export const updateEvents = async (
  events: AwsNamedEvent[],
  name: string,
  user: string,
) => {
  const response = await fetch(`${invokeUrl}config/event`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify(events),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Name created in API gateway');
  }
  return response.json();
};

export const deleteEvent = async (event: AwsNamedEvent, user: string) => {
  const response = await fetch(`${invokeUrl}config/event/${event.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify({ event }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Event deleted from API gateway');
  }
  return response.json();
};
