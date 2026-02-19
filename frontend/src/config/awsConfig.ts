const invokeUrl = import.meta.env.VITE_AWS_INVOKE_URL;

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

export const sendToAws = async (
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
