const API_BASE_URL = "https://videosdk-switch-relay-api-server-production.up.railway.app";

export const createRoom = async () => {
  const tempToken = await fetch(`${API_BASE_URL}/get-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId: "", peerId: "" }),
  });

  if (!tempToken.ok) {
    throw new Error("Failed to get temporary token for room creation.");
  }
  const { token: apiToken } = await tempToken.json();

  const createRoom = await fetch(`${API_BASE_URL}/create-meeting/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: apiToken, region: "in" }),
  });

  if (!createRoom.ok) {
    const errorText = await createRoom.text();
    console.error("Error creating meeting:", errorText);
    throw new Error(`Failed to create meeting. Server response: ${createRoom.status}`);
  }

  const result = await createRoom.json();

  return result.roomId;
}

export const getTokenForRoom = async (roomId, peerId) => {
  const res = await fetch(`${API_BASE_URL}/get-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId: roomId, peerId: peerId }),
  });

  if (!res.ok) {
    throw new Error("Failed to get token for room.");
  }
  const { token } = await res.json();
  return token;
}