import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";

const MeetingView = ({ roomIdA, roomIdB, token, setRoomState }) => {
  const [currentRoom, setCurrentRoom] = useState(roomIdA);
  const [isRelaying, setIsRelaying] = useState(false);

  const {
    participants,
    localParticipant,
    leave,
    switchTo,
    requestMediaRelay,
    acceptMediaRelayRequest
  } = useMeeting();

  if (!localParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-blue-600">
          Connecting to Room A... Please wait.
        </p>
      </div>
    );
  }

  const remoteParticipants = [...participants.keys()].filter(
    (participantId) => participantId !== localParticipant.id
  );

  const renderParticipants = (ids) => ids.map((id) => (
    <ParticipantView key={id} participantId={id} />
  ));

  const handleSwitchToRoomB = async () => {
    if (currentRoom === roomIdA) {
      try {
        await switchTo({
          meetingId: roomIdB,
          token: token
        });

        setCurrentRoom(roomIdB);
        console.log("Successfully switched to Room B");
      } catch (error) {
        console.error("Failed to switch rooms:", error);
        alert("Failed to switch rooms. Check console.");
      }
    }
  };

  const handleStartMediaRelay = async () => {
    if (currentRoom === roomIdA && !isRelaying) {
      try {
        await requestMediaRelay({
          meetingId: roomIdB,
          token: token,
          media: ["audio", "video"],
        });
        setIsRelaying(true);
        console.log("Media relay request sent to Room B");
      } catch (error) {
        console.error("Failed to start media relay:", error);
      }
    }
  };

  useEffect(() => {
    const onMediaRelayRequestReceived = (requesterId, requestId) => {
      console.log(`Media relay request received from ${requesterId}. Accepting...`);
      acceptMediaRelayRequest(requestId);
    };

    if (currentRoom === roomIdB) {
      // The listener should be added when the meeting state is ready.
      // For simplicity in this component, we log it. 
      // In a separate Room B meeting, this event is standard.
    }
  }, [currentRoom, acceptMediaRelayRequest]); // Re-run if room changes

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Current Room: {currentRoom === roomIdA ? "Room A" : "Room B"}
      </h1>
      <p className="mb-4 text-gray-600">
        Local Participant ID: <span className="font-mono">{localParticipant.id}</span>
      </p>

      {/* Control Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleSwitchToRoomB}
          disabled={currentRoom === roomIdB}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {currentRoom === roomIdA ? "Seamless Switch to Room B" : "Currently in Room B"}
        </button>

        <button
          onClick={handleStartMediaRelay}
          disabled={currentRoom !== roomIdA || isRelaying}
          className={`px-6 py-2 rounded-lg text-white ${isRelaying ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isRelaying ? "Relaying Media to B..." : "Start Media Relay to Room B"}
        </button>

        <button
          onClick={() => {
            leave();
            setRoomState(null); // Return to join screen
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Leave Meeting
        </button>
      </div>

      {/* Participant Grid */}
      <h2 className="text-xl font-semibold mb-3">Participants ({participants.size})</h2>
      <div className="flex flex-wrap">
        {/* Local Participant */}
        <ParticipantView participantId={localParticipant.id} />

        {/* Remote Participants */}
        {remoteParticipants.length > 0 ? (
          renderParticipants(remoteParticipants)
        ) : (
          <p className="text-gray-500 m-2">No other participants in this room.</p>
        )}
      </div>
    </div>
  );
};

export default MeetingView;