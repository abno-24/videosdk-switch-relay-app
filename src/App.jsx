import React, { useState } from 'react';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import JoinScreen from './components/JoinScreen';
import MeetingView from './components/MeetingView';

const onMeetingJoined = () => {
  console.log("MEETING EVENT: Successfully joined the meeting!");
};

const onMeetingLeft = () => {
  console.log("MEETING EVENT: Left the meeting.");
};

const onSpeakerChanged = (activeSpeakerId) => {
  console.log(`MEETING EVENT: Active speaker changed to ${activeSpeakerId}`);
};

const onConnectionOpen = () => {
  console.log("MEETING EVENT: Connection opened. SDK is active.");
};

// This is crucial for catching errors
const onConnectionError = (data) => {
  console.error("MEETING EVENT: Connection Error!", data);
  alert(`Connection Error: ${data.message || 'Check console for details.'}`);
};

function App() {
  const [roomState, setRoomState] = useState(null);

  if (!roomState) {
    return <JoinScreen setRoomState={setRoomState} />;
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomState.roomIdA, // Start in Room A
        micEnabled: true,
        webcamEnabled: true,
        participantId: roomState.peerId,
        displayName: roomState.name,
      }}
      token={roomState.token}

      events={{
        onMeetingJoined,
        onMeetingLeft,
        onSpeakerChanged,
        onConnectionOpen,
        onConnectionError,
        onMicRequested: ({ accept, reject }) => {
          console.log("Microphone access requested.");
          accept();
        },
        onWebcamRequested: ({ accept, reject }) => {
          console.log("Webcam access requested.");
          accept();
        },
      }}
    >
      <MeetingView
        roomIdA={roomState.roomIdA}
        roomIdB={roomState.roomIdB}
        token={roomState.token}
        setRoomState={setRoomState}
      />
    </MeetingProvider>
  )
}

export default App
