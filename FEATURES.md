# Frequency Healing Platform - Features & Functions

## Table of Contents

1. [Core Features](#core-features)
2. [AI Agent Pipeline](#ai-agent-pipeline)
3. [Audio System](#audio-system)
4. [Database Entities](#database-entities)
5. [API Endpoints](#api-endpoints)
6. [Frontend Routes](#frontend-routes)
7. [Authentication](#authentication)
8. [Security](#security)

---

## Core Features

### User Management
- User registration with email/password
- User login with JWT authentication
- Role-based access control (user/admin)
- Session tracking

### Onboarding System
- Multi-step form with validation
- Collects: goal, issue, mood, sleep_quality, preferences
- State persistence in database
- Automatic pipeline trigger on completion

### Frequency Library
Pre-seeded with 17 healing frequencies:

| Frequency | Hz | Category | Description |
|----------|-----|----------|-------------|
| 396 Hz | Solfeggio | Liberation - frees guilt and fear |
| 417 Hz | Solfeggio | Change - facilitates change |
| 528 Hz | Solfeggio | DNA Repair - healing DNA |
| 639 Hz | Solfeggio | Relationships - harmonizes relationships |
| 741 Hz | Solfeggio | Expression - awakens expression |
| 852 Hz | Solfeggio | Third Eye - activates intuition |
| 963 Hz | Solfeggio | Crown - activates crown chakra |
| 174 Hz | Healing | Foundation - pain relief |
| 285 Hz | Healing | Tissue Healing - heals tissues |
| 432 Hz | Healing | Universal - natural healing |
| 528 Hz | Healing | Miracle - miracle tone |
| 888 Hz | Healing | Salvation - spiritual salvation |
| 2 Hz | Brainwave | Delta - deep sleep and healing |
| 6 Hz | Brainwave | Theta - meditation and creativity |
| 10 Hz | Brainwave | Alpha - relaxation and calm |
| 14 Hz | Brainwave | Beta - focus and alertness |
| 35 Hz | Brainwave | Gamma - peak cognition |

### Duration System
- 5 minutes
- 10 minutes
- 20 minutes
- 30 minutes
- Custom duration support

### Adaptive Session System
- Sessions divided into evolving segments
- Example timeline (20 min):
  - 0-5 min: Theta wave (soft)
  - 5-10 min: Deeper Theta
  - 10-15 min: Delta wave
  - 15-20 min: Alpha exit

---

## AI Agent Pipeline

### 1. ProfileAnalysisAgent
**File**: `agents/profile-analysis.agent.ts`

**Input**:
```typescript
{
  goal?: string,
  issue?: string,
  mood?: string,
  sleepQuality?: string,
  preferences?: string
}
```

**Output**:
```typescript
{
  goalType: 'sleep' | 'meditation' | 'focus' | 'healing' | 'relaxation',
  moodState: 'happy' | 'calm' | 'anxious' | 'sad' | 'tired' | 'energetic',
  intensityLevel: number,
  recommendedBrainwave: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'
}
```

**Logic**:
- Maps goal to base frequency and brainwave type
- Adjusts intensity based on mood
- Considers issues and sleep quality

---

### 2. FrequencySelectionAgent
**File**: `agents/frequency-selection.agent.ts`

**Input**: ProfileAnalysisResult

**Output**:
```typescript
{
  baseFrequency: number,
  brainwave: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma',
  category: 'solfeggio' | 'healing' | 'brainwave',
  binauralBeat: number
}
```

**Logic**:
- Selects primary frequency based on goal
- Calculates binaural beat frequency
- Adjusts based on mood state

---

### 3. AudioParameterAgent
**File**: `agents/audio-parameter.agent.ts`

**Input**: FrequencySelectionResult + durationMinutes

**Output**:
```typescript
{
  leftFrequency: number,
  rightFrequency: number,
  pitch: number,
  depth: number,
  intensity: number,
  duration: number
}
```

**Logic**:
- Calculates left/right frequencies for binaural beat
- Sets pitch adjustment
- Configures depth (LFO intensity)
- Sets overall intensity

---

### 4. SessionBuilderAgent
**File**: `agents/session-builder.agent.ts`

**Input**: AudioParameterResult + durationMinutes

**Output**:
```typescript
SessionSegment[] = [
  {
    startTime: number,
    endTime: number,
    parameters: {
      leftFrequency: number,
      rightFrequency: number,
      pitch: number,
      depth: number,
      intensity: number
    }
  }
]
```

**Logic**:
- Creates 2-5 segments based on duration
- Evolves parameters over time
- Starts soft, increases depth, transitions to alpha at end

---

### 5. AudioGenerationAgent
**File**: `agents/audio-generation.agent.ts`

**Input**: SessionSegment[] + durationMinutes + userId

**Output**:
```typescript
{
  audioUrl: string,
  duration: number
}
```

**Logic**:
- Uses ffmpeg to generate sine wave
- Applies advanced filters (lowpass, highpass, echo)
- Saves to `/public/audio/{user_id}_{timestamp}.mp3`
- Implements audio caching

**FFmpeg Filters Used**:
- `sine` - Base waveform
- `volume` - Intensity control
- `lowpass` - Frequency cap
- `highpass` - Remove low rumble
- `aecho` - Echo effect

---

## Audio System

### Backend - AudioService
**File**: `audio/audio.service.ts`

**Functions**:
- `generateAudio(params, durationMinutes, userId)` - Generate audio file
- `generateBinauralBeat(baseFreq, beatFreq, durationSeconds, userId)` - Binaural generation
- `generateAdaptiveAudio(segments, userId)` - Multi-segment generation
- `checkCache(params, durationMinutes)` - Check cached audio
- `saveToCache(params, durationMinutes, audioUrl)` - Save to cache

### Frontend - Basic Audio Engine
**File**: `lib/audioEngine.ts`

**Features**:
- AudioContext initialization
- Oscillator generation (left/right channels)
- GainNode for volume control
- BiquadFilterNode for filtering
- StereoPannerNode for stereo effect
- Real-time segment tracking
- Time update callbacks

### Frontend - Advanced Audio Engine
**File**: `lib/advancedAudioEngine.ts`

**Advanced Features**:

| Function | Description | Parameters |
|----------|-------------|-------------|
| `setVolumeLevel` | Control volume | `value: number (0-1)` |
| `setPlaybackSpeed` | Pitch + speed control | `speed: number` |
| `setFilterSweep` | Dynamic filter change | `targetFreq, duration` |
| `applyStereoDrift` | Gradual panning | `from, to, duration` |
| `applyEnvelope` | Fade in/out | `fadeIn, fadeOut` |
| `startLfo` | LFO modulation | `rate, depth` |
| `stopLfo` | Stop modulation | - |
| `seekTo` | Seek to time | `time: number` |
| `loopAudio` | Seamless loop | `enabled: boolean` |
| `loadAudioBuffer` | Preload audio | `url: string` |

---

## Database Entities

### User
**File**: `entities/user.entity.ts`

```typescript
{
  id: string,           // UUID
  email: string,        // Unique
  passwordHash: string,
  role: 'user' | 'admin',
  createdAt: Date
}
```

### UserProfile
**File**: `entities/user-profile.entity.ts`

```typescript
{
  id: string,
  userId: string,      // Foreign key
  goal: string,
  issue: string,
  mood: string,
  sleepQuality: string,
  preferences: string,
  customGoal: string,
  createdAt: Date
}
```

### Frequency
**File**: `entities/frequency.entity.ts`

```typescript
{
  id: string,
  title: string,
  category: string,     // 'solfeggio' | 'healing' | 'brainwave'
  frequency: number,  // Hz value
  brainwaveType: string,
  minHz: number,
  maxHz: number,
  description: string,
  audioUrl: string,
  duration: string,
  createdAt: Date
}
```

### PersonalizedFrequency
**File**: `entities/personalized-frequency.entity.ts`

```typescript
{
  id: string,
  userId: string,
  title: string,
  generatedAudioUrl: string,
  parameters: {
    baseFrequency: number,
    leftFrequency: number,
    rightFrequency: number,
    brainwave: string,
    pitch: number,
    depth: number,
    intensity: number,
    duration: number
  },
  createdAt: Date
}
```

### Session
**File**: `entities/session.entity.ts`

```typescript
{
  id: string,
  userId: string,
  personalizedFrequencyId: string,
  segments: SessionSegment[],
  durationMinutes: number,
  audioUrl: string,
  completed: boolean,
  listenedSeconds: number,
  createdAt: Date
}

SessionSegment = {
  startTime: number,
  endTime: number,
  parameters: {
    leftFrequency: number,
    rightFrequency: number,
    pitch: number,
    depth: number,
    intensity: number
  }
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profile` | Create profile |
| PUT | `/profile` | Update profile |
| GET | `/profile` | Get profile |
| GET | `/profile/check` | Check onboarding status |

### Personalized
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/personalized` | Get all personalized frequencies |
| POST | `/personalized/generate` | Generate new session |
| GET | `/personalized/sessions` | Get user sessions |
| GET | `/personalized/sessions/:id` | Get specific session |
| POST | `/personalized/sessions/:id/complete` | Mark session complete |

### Frequencies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/frequencies` | Get all frequencies |
| GET | `/frequencies/:id` | Get specific frequency |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get authenticated user profile |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/frequencies` | Get all frequencies (admin) |
| POST | `/admin/frequencies` | Create frequency (admin) |
| PUT | `/admin/frequencies/:id` | Update frequency (admin) |
| DELETE | `/admin/frequencies/:id` | Delete frequency (admin) |

---

## Frontend Routes

| Route | Page | Auth Required |
|-------|------|-------------|
| `/` | Landing Page | No |
| `/login` | Login | No |
| `/onboarding` | Onboarding | Yes |
| `/dashboard` | Dashboard | Yes |
| `/player/:id` | Player | Yes |
| `/profile` | Profile | Yes |
| `/admin` | Admin Panel | Yes (admin only) |
| `/frequencies/:category` | Frequency List | No |

---

## Authentication

### JWT Token
- Token generated on login/register
- Expires in 7 days
- Stored in localStorage
- Sent in Authorization header

### Auth Store (Zustand)
**File**: `store/authStore.ts`

```typescript
{
  user: { id, email, role } | null,
  token: string | null,
  isAuthenticated: boolean,
  setUser(user),
  setToken(token),
  logout()
}
```

### Audio Store (Zustand)
**File**: `store/audioStore.ts`

```typescript
{
  currentUrl: string | null,
  isPlaying: boolean,
  audio: HTMLAudioElement | null,
  play(url),
  pause(),
  setCurrentUrl(url),
  setIsPlaying(playing)
}
```

---

## Security

### Backend Guards

#### JwtAuthGuard
- Validates JWT token from Authorization header
- Attaches user to request

#### AdminGuard
**File**: `admin/admin.guard.ts`
- Checks if user.role === 'admin'
- Throws ForbiddenException if not admin

### Frontend Protection
- Admin routes check user role
- Redirect non-admin users to dashboard
- Protected routes check for token

---

## Admin Panel

### Isolation Rules
- Completely separate layout from user UI
- Gray color scheme (not used in user app)
- No shared navigation component
- Protected by role check

### Features
- Frequency management (CRUD)
- View all frequencies
- Add new frequencies
- Edit existing frequencies
- Delete frequencies

---

## Waveform System

### Component
**File**: `components/Waveform.tsx`

- Canvas-based animation
- Sine wave rendering
- Uses requestAnimationFrame for smooth animation
- Plays/stops based on audio state
- Color: Purple (#8B5CF6)

---

## Hero Background

### Component
**File**: `components/HeroBackground.tsx`

- Animated gradient background
- Wave animation using sine waves
- Radial gradient (purple to blue)
- Responsive to window size

---

## Navigation

### User Navigation
**File**: `components/Navigation.tsx`

- Fixed position at top
- Links: Home, Dashboard, Profile
- Logout button
- Gradient text for logo

### Admin Navigation
- Defined in admin page
- Gray background
- Separate from user navigation

---

## Running the Platform

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- ffmpeg (in PATH)

### Setup
```bash
npm install
npm run dev
```

### Development Servers
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Build
```bash
npm run build
```

---

## File Structure

```
/apps/api/src/
├── agents/
│   ├── profile-analysis.agent.ts
│   ├── frequency-selection.agent.ts
│   ├── audio-parameter.agent.ts
│   ├── session-builder.agent.ts
│   ├── audio-generation.agent.ts
│   └── agents.module.ts
├── audio/
│   ├── audio.service.ts
│   └── audio.module.ts
├── pipeline/
│   ├── pipeline.service.ts
│   ├── pipeline.controller.ts
│   └── pipeline.module.ts
├── entities/
│   ├── user.entity.ts
│   ├── user-profile.entity.ts
│   ├── frequency.entity.ts
│   ├── personalized-frequency.entity.ts
│   └── session.entity.ts
└── main.ts

/apps/web/src/
├── app/
│   ├── page.tsx                    # Landing
│   ├── login/                     # Login
│   ├── onboarding/               # Onboarding
│   ├─��� dashboard/               # Dashboard
│   ├── player/[id]/             # Player
│   ├── profile/                 # Profile
│   └── admin/                   # Admin
├── lib/
│   ├── api.ts                   # API client
│   ├── audioEngine.ts            # Basic audio
│   └── advancedAudioEngine.ts  # Advanced audio
├── components/
│   ├── Navigation.tsx
│   ├── HeroBackground.tsx
│   └── Waveform.tsx
└── store/
    ├── authStore.ts
    └── audioStore.ts
```

---

## Version

1.0.0