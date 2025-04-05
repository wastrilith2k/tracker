const invokeUrl =
  'https://2ribv7ubh0.execute-api.us-east-1.amazonaws.com/Production';

// Create a new payload for being sent to the API gateway
// Add everything from Statsig and include the hour as well
// Change from using the email on the user to using the userId

// create a method that will send the same payload in statsigCOnfig.ts to the API gateway's invokeUrl
export const sendPayload = async (payload: any) => {
  const response = await fetch(invokeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    console.log('Payload sent to API gateway', response.json());
  }
  return response.json();
};

export const sendToAws = async (
  name: string,
  event: string,
  user: string,
  comment: string | null,
) => {
  const hour = new Date().getHours();
  const date = new Date().toISOString().split('T')[0];
  const payload = { name, event, user, comment, hour, date };
  console.log('Payload to be sent to API gateway', payload);
  return sendPayload(payload);
};
