import React, { useEffect, useState } from 'react';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import JoinScreen from './components/JoinScreen';
import MeetingView from './components/MeetingView';
import { getTokenForRoom } from "./API";

const VIDEOSDK_API_KEY = "800a7fa5-7e44-49b5-8b2d-16fbdf346640";

function App() {
  const [roomState, setRoomState] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!roomState) return;

    const fetchToken = async () => {
      const t = await getTokenForRoom(roomState.roomIdA, roomState.peerId);
      setToken(t);
    };

    fetchToken();
  }, [roomState]);

  if (!roomState || !token) {
    return <JoinScreen setRoomState={setRoomState} />;
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomState.roomIdA,
        participantId: roomState.peerId,
        displayName: roomState.name,
        micEnabled: true,
        webcamEnabled: true,
        apiKey: VIDEOSDK_API_KEY,
      }}
      token={token}
    >
      <MeetingView
        roomIdA={roomState.roomIdA}
        roomIdB={roomState.roomIdB}
        peerId={roomState.peerId}
        setRoomState={setRoomState}
        setToken={setToken}
      />
    </MeetingProvider>
  )
}

export default App
