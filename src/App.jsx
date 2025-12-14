import { useEffect, useState } from 'react';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import JoinScreen from './components/JoinScreen';
import MeetingView from './components/MeetingView';
import { getTokenForRoom } from "./API";

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
