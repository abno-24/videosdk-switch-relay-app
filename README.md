# VideoSDK Participant Room Switch & Media Relay Demo

This project demonstrates seamless participant room switching and Media Relay
using the VideoSDK React SDK.

The application was built as part of a VideoSDK assignment to showcase:
- Normal room switching
- Room switching using Media Relay
- Proper token handling and SDK lifecycle management

---

## 🚀 Project Setup

### Prerequisites
- Node.js (v18 or above)
- npm or yarn

### Installation Steps

```bash
git clone https://github.com/abno-24/videosdk-switch-relay-app
cd videosdk-switch-relay-app
npm install
npm run dev
```

### The application will run on:
```
http://localhost:5173
```

## 🏗️ Project Architecture

- JoinScreen
  - Creates (or reuses) Room A and Room B
  - Generates a unique peer ID per browser tab
  - Fetches token for Room A

- MeetingView
  - Joins Room A initially
  - Allows:
    - Normal room switching (Room A → Room B)
    - Media Relay (relay audio/video to Room B)

- ParticipantView
  - Renders participant video using VideoSDK VideoPlayer
  - Handles microphone stream safely using MediaStream tracks

## 🔁 Normal Room Switching

Normal room switching allows a participant to completely move from one VideoSDK room to another.

### Implementation Details

Normal switching is implemented using VideoSDK’s `switchTo` method.

**Flow:**
1. The user initially joins **Room A**
2. On clicking **“Switch to Room B”**:
   - A new token is generated for Room B
   - The `switchTo({ meetingId, token })` method is called
3. The participant leaves Room A and joins Room B

**Key Characteristics:**
- Participant is removed from Room A
- Participant joins Room B as a new participant
- Audio and video streams are renegotiated
- A brief transition may occur during the switch

This approach is suitable when a participant needs to fully move between rooms.

---

## 🔄 Room Switching Using Media Relay

Media Relay allows a participant’s media (audio/video) to be sent from one room to another **without switching rooms**.

### Implementation Details

Media Relay is implemented using VideoSDK’s `requestMediaRelay` method.

**Flow:**
1. The user joins **Room A**
2. Another participant joins **Room B** (in a different browser tab)
3. On clicking **“Start Media Relay”** in Room A:
   - Audio and video streams from Room A are relayed to Room B
   - The participant remains connected to Room A

**Key Characteristics:**
- Participant does NOT leave Room A
- Media is mirrored into Room B
- No new participant entry is created in Room B
- No reconnection or renegotiation occurs

This approach is useful for broadcasting, monitoring, or overflow scenarios.

---

## ⚖️ Normal Switching vs Media Relay

| Aspect | Normal Switching | Media Relay |
|------|----------------|-------------|
| Room Change | Yes | No |
| Participant Reconnect | Yes | No |
| Media Renegotiation | Yes | No |
| Use Case | Full room transition | Broadcasting / monitoring |
| Connection Stability | Momentary interruption | Seamless |

---

## ⚠️ Limitations & Challenges

- Media Relay requires **both rooms to exist**
- Relay works only when another participant is present in the target room
- Tokens must be generated correctly for each room
- Media Relay does not create a visible participant in the target room
- Browser autoplay restrictions may block audio until user interaction
