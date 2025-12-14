import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createRoom, getTokenForRoom } from '../API';

const JoinScreen = ({ setRoomState }) => {
  const [name, setName] = useState('');
  const [token, setToken] = useState(null);
  const [roomIdA, setRoomIdA] = useState(null);
  const [roomIdB, setRoomIdB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const peerId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    const initRoomsAndToken = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Check if rooms already exist (shared across tabs)
        let roomA = localStorage.getItem("VIDEOSDK_ROOM_A");
        let roomB = localStorage.getItem("VIDEOSDK_ROOM_B");

        // 2️⃣ Create rooms ONLY if they do not exist
        if (!roomA || !roomB) {
          roomA = await createRoom();
          roomB = await createRoom();

          localStorage.setItem("VIDEOSDK_ROOM_A", roomA);
          localStorage.setItem("VIDEOSDK_ROOM_B", roomB);
        }

        setRoomIdA(roomA);
        setRoomIdB(roomB);

        // 3️⃣ Get token ONLY for Room A initially
        const meetingToken = await getTokenForRoom(roomA, peerId);
        setToken(meetingToken);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize rooms. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    initRoomsAndToken();
  }, []);

  const handleJoin = () => {
    if (!name || !token || !roomIdA || !roomIdB) return;

    setRoomState({
      name,
      peerId,
      token,
      roomIdA,
      roomIdB,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
          VideoSDK Room Switcher
        </h1>

        {loading && (
          <div className="text-center text-blue-600 mb-4">
            <p>Preparing Rooms A and B...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {roomIdA && roomIdB && (
          <>
            <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Room A:</span> {roomIdA}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Room B:</span> {roomIdB}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Peer ID:</span> {peerId}
              </p>
            </div>

            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            <button
              onClick={handleJoin}
              disabled={!name}
              className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50"
            >
              Join Room A
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinScreen;