# Frequency Healing Platform

A complete enterprise-grade full-stack application for personalized healing frequency therapy with AI-driven audio generation.

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Web Audio API** - Real-time audio processing

### Backend
- **NestJS** - Framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database

### Audio
- **ffmpeg** - Audio generation (must be installed locally)

---

## Architecture

```
/apps
  /web        → Next.js frontend (port 3000)
  /api        → NestJS backend (port 3001)
/packages
  /config     → Shared configuration
  /ui         → Shared UI components
```

---

## Features

### Onboarding System
- Multi-step form collecting: goal, issue, mood, sleep_quality, preferences
- Validation and state persistence

### Multi-AI Agent Pipeline
1. **ProfileAnalysisAgent** - Analyzes user profile
2. **FrequencySelectionAgent** - Selects frequencies based on analysis
3. **AudioParameterAgent** - Generates audio parameters
4. **SessionBuilderAgent** - Creates adaptive session segments
5. **AudioGenerationAgent** - Generates audio using ffmpeg

### Adaptive Session System
- Sessions evolve over time (theta → delta → alpha)
- Multiple segments based on duration

### Advanced Audio Engine
- Real-time pitch control
- Playback rate adjustment
- Envelope (fade-in/fade-out)
- LFO modulation
- Filter sweep
- Stereo drift
- Buffer preloading
- Loop control

### Frequency Library
- **Solfeggio**: 396, 417, 528, 639, 741, 852, 963 Hz
- **Healing**: 174, 285, 432, 528, 888 Hz
- **Brainwaves**: Delta (0.5-4Hz), Theta (4-8Hz), Alpha (8-12Hz), Beta (12-30Hz), Gamma (30+Hz)

---

## Prerequisites

1. **Node.js 18+**
2. **PostgreSQL 14+**
3. **ffmpeg** - Must be installed and in PATH
   - Windows: `choco install ffmpeg`
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

---

## Setup

### 1. Create Database

```sql
CREATE DATABASE frequency_healing;
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=frequency_healing
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### 4. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## Frontend Routes

| Route | Description |
|-------|-----------|
| `/` | Landing page |
| `/login` | Authentication |
| `/onboarding` | Multi-step onboarding |
| `/dashboard` | Sessions dashboard |
| `/player/[id]` | Audio player |
| `/profile` | User profile |
| `/admin` | Admin panel (isolated) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/profile` | Create profile |
| GET | `/profile` | Get profile |
| GET | `/personalized` | Get personalized frequencies |
| POST | `/personalized/generate` | Generate new session |
| GET | `/personalized/sessions` | Get user sessions |
| GET | `/frequencies` | Get frequency library |

---

## Audio System Usage

### Advanced Features

```typescript
import { useAdvancedAudioEngine } from '@/lib/advancedAudioEngine';

const { 
  playWithAudioElement,
  pause,
  setVolumeLevel,
  setPlaybackSpeed,
  setFilterSweep,
  applyStereoDrift,
  applyEnvelope,
  startLfo,
  stopLfo,
  seekTo,
  loopAudio,
} = useAdvancedAudioEngine();

// Play audio
playWithAudioElement('/audio/file.mp3', segments);

// Set volume
setVolumeLevel(0.7);

// Change playback speed
setPlaybackSpeed(1.5);

// Filter sweep
setFilterSweep(4000, 5);

// Apply stereo drift
applyStereoDrift(0, 1, 10);

// Fade in/out
applyEnvelope(2, 3);

// LFO modulation
startLfo(0.5, 0.3);

// Seek
seekTo(30);

// Loop
loopAudio(true);
```

---

## Database Schema

### User
- id, email, password_hash, role, created_at

### UserProfile  
- id, user_id, goal, issue, mood, sleep_quality, preferences, created_at

### Frequency
- id, title, category, frequency, brainwave_type, min_hz, max_hz, description

### PersonalizedFrequency
- id, user_id, title, generated_audio_url, parameters (JSON), created_at

### Session
- id, user_id, personalized_frequency_id, segments (JSON), duration_minutes, audio_url, completed, listened_seconds, created_at

---

## Running in Production

```bash
npm run build
npm run start:prod
```

---

## License

MIT