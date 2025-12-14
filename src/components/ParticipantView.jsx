import { useParticipant, useStream } from "@videosdk.live/react-sdk";
import React, { useRef, useEffect } from "react";

const ParticipantView = ({ participantId }) => {
  const { webcamStream, micStream, webcamOn, displayName } = useParticipant(participantId);

  const { stream: videoStream } = useStream(webcamStream);
  const { stream: audioStream } = useStream(micStream);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // if (!videoStream && !audioStream) {
  //   if (participantId !== localParticipant.id) {
  //     // We can skip this check for now, but in complex scenarios it's useful.
  //   }
  // }

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);

  useEffect(() => {
    if (audioRef.current && audioStream) {
      audioRef.current.srcObject = audioStream;
      audioRef.current.play();
    }
  }, [audioStream]);

  return (
    <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center m-2 shadow-xl w-64 h-48">
      <p className="text-white font-bold mb-2">
        {displayName} {webcamOn ? "" : "(Webcam Off)"}
      </p>

      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          muted={true}
          className="w-full h-full object-cover rounded"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded">
          <span className="text-gray-400 text-lg">No Video</span>
        </div>
      )}

      <audio ref={audioRef} autoPlay muted={false} />
    </div>
  );
};

export default ParticipantView;