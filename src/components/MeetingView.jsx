import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import { getTokenForRoom } from "../API";

const MeetingView = ({ roomIdA, roomIdB, peerId, setRoomState, setToken }) => {
  const [currentRoom, setCurrentRoom] = useState(roomIdA);
  const [joined, setJoined] = useState(false);

  const {
    join,
    leave,
    participants,
    localParticipant,
    switchTo,
    requestMediaRelay,
  } = useMeeting({
    onMeetingJoined: () => {
      setJoined(true);
    },
    onMeetingLeft: () => {
      setJoined(false);
      setRoomState(null);
    },
  });

  useEffect(() => {
    join();
  }, []);

  if (!joined || !localParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-blue-600">
          Joining Room A...
        </p>
      </div>
    );
  }

  const handleSwitchRoom = async () => {
    const newToken = await getTokenForRoom(roomIdB, peerId);

    switchTo({
      meetingId: roomIdB,
      token: newToken,
    });

    setToken(newToken);
    setCurrentRoom(roomIdB);
  };

  const handleRelay = async () => {
    const relayToken = await getTokenForRoom(roomIdB, peerId);

    await requestMediaRelay({
      destinationMeetingId: roomIdB,
      token: relayToken,
      media: ["audio", "video"],
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Current Room: {currentRoom === roomIdA ? "Room A" : "Room B"}
      </h1>
      <p className="mb-4 text-gray-600">
        Room ID: <span className="font-mono">{currentRoom === roomIdA ? roomIdA : roomIdB}</span>
      </p>
      <p className="mb-4 text-gray-600">
        Local Participant ID: <span className="font-mono">{localParticipant.id}</span>
      </p>

      {/* Control Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleSwitchRoom}
          disabled={currentRoom === roomIdB}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {currentRoom === roomIdA ? "Seamless Switch to Room B" : "Currently in Room B"}
        </button>

        <button
          onClick={handleRelay}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Start Media Relay
        </button>

        <button
          onClick={() => {
            leave();
            setRoomState(null); // Return to join screen
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Leave
        </button>
      </div>

      {/* Participant Grid */}
      <div className="flex flex-wrap">
        {localParticipant && (
          <ParticipantView participantId={localParticipant.id} />
        )}
        {[...participants.keys()]
          .filter((id) => id !== localParticipant?.id)
          .map((id) => (
            <ParticipantView key={id} participantId={id} />
          ))}
      </div>
    </div>
  );
};

export default MeetingView;