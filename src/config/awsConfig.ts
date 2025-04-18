import { invokeUrl } from '../utils/constants';
import { AwsName } from '../utils/types';

// create a method that will send the same payload in statsigCOnfig.ts to the API gateway's invokeUrl
export const sendPayload = async (payload: any) => {
  const response = await fetch(`${invokeUrl}items`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Payload sent to API gateway');
  }
};

export const sendEventToAWS = async (
  name: string,
  event: string,
  user: string,
  comment: string | null,
) => {
  const hour = new Date().getHours();
  const date = new Date(new Date().toLocaleDateString())
    .toISOString()
    .split('T')[0];
  const payload = { name, event, user, comment, hour, date };
  console.debug('Payload to be sent to API gateway', payload);
  return sendPayload(payload);
};

export const fetchMetrics = async (name: string, user: string) => {
  const response = await fetch(`${invokeUrl}metrics/${name}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Metrics fetched from API gateway');
  }
  return response.json();
};

export const createName = async (name: string, user: string) => {
  const response = await fetch(`${invokeUrl}config/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Name created in API gateway');
  }
  return response.json();
};

export const fetchNames = async (user: string) => {
  const response = await fetch(`${invokeUrl}config/name`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Names fetched from API gateway');
  }
  return response.json();
};

export const updateNames = async (names: AwsName[], user: string) => {
  const response = await fetch(`${invokeUrl}config/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify(names),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Name created in API gateway');
  }
  return response.json();
};

export const deleteName = async (name: AwsName, user: string) => {
  const response = await fetch(`${invokeUrl}config/name/${name.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Event-User': user,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.debug('Name deleted from API gateway');
  }
  return response.json();
};
