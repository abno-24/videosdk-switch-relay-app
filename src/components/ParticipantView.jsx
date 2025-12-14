import { useRef, useEffect } from "react";
import { useParticipant, VideoPlayer } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const micRef = useRef(null);
  const { 
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName, 
  } = useParticipant(participantId);

  useEffect(() => {
    if (!micRef.current) return;

    if (micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);

      micRef.current.srcObject = mediaStream;
      micRef.current
        .play()
        .catch((err) =>
          console.error("Audio play failed:", err)
        );
    } else {
      micRef.current.srcObject = null;
    }
  }, [micStream, micOn]);

  return (
    <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center m-2 shadow-xl w-80 h-60">
      <p className="text-white text-sm mb-2">
        {displayName} | Mic: {micOn ? "ON" : "OFF"}
      </p>

      {webcamOn ? (
        <VideoPlayer
          participantId={participantId}
          type="video"
          className="rounded"
          containerStyle={{ width: "100%", height: "240px" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded">
          <span className="text-gray-400 text-lg">No Video</span>
        </div>
      )}

      <audio
        ref={micRef}
        autoPlay
        playsInline
        muted={isLocal}
      />
    </div>
  );
};

export default ParticipantView;