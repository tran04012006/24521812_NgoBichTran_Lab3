Task 1
│
├── 1. Project Initialization
│   ├── 1.1 Create Vite + React 19 project
│   ├── 1.2 Configure package.json
│   ├── 1.3 Configure Vite
│   └── 1.4 Create React entry point
│
├── 2. Piano Data Generation
│   ├── 2.1 Define MIDI range (21–108)
│   ├── 2.2 Generate 88 keys with a loop
│   ├── 2.3 Convert MIDI numbers to note names
│   ├── 2.4 Calculate note frequencies
│   ├── 2.5 Identify black and white keys
│   └── 2.6 Calculate keyboard positions
│
├── 3. React Components
│   ├── 3.1 Create PianoKey component
│   ├── 3.2 Optimize PianoKey with React.memo
│   ├── 3.3 Create Piano component
│   ├── 3.4 Render all 88 keys
│   └── 3.5 Create App component
│
├── 4. User Interface
│   ├── 4.1 Build piano keyboard layout
│   ├── 4.2 Style black and white keys
│   ├── 4.3 Add horizontal scrolling
│   ├── 4.4 Highlight selected key
│   └── 4.5 Display note information
│
├── 5. Verification
│   ├── 5.1 Verify exactly 88 keys
│   ├── 5.2 Verify 52 white keys
│   ├── 5.3 Verify 36 black keys
│   ├── 5.4 Verify A0 and C8 boundaries
│   ├── 5.5 Verify A4 = 440 Hz
│   └── 5.6 Verify keyboard interactions
Task 2
│
├── 1. Audio Engine Initialization
│   ├── 1.1 Create src/audio/PolyphonicSynth.js
│   ├── 1.2 Define PolyphonicSynth class
│   ├── 1.3 Lazily initialize AudioContext
│   ├── 1.4 Create master gain node
│   └── 1.5 Resume suspended audio context
│
├── 2. Voice Management
│   ├── 2.1 Define maximum voices = 8
│   ├── 2.2 Create ES6 Map for active voices
│   ├── 2.3 Create one oscillator per note
│   ├── 2.4 Create one gain node per note
│   ├── 2.5 Store voices by MIDI number
│   └── 2.6 Track active voice count
│
├── 3. FIFO Voice Stealing
│   ├── 3.1 Detect when 8 voices are active
│   ├── 3.2 Find oldest MIDI key in Map
│   ├── 3.3 Release the oldest oscillator
│   ├── 3.4 Remove oldest voice from Map
│   └── 3.5 Insert the new voice
│
├── 4. ADSR Audio Envelope
│   ├── 4.1 Set safe initial gain
│   ├── 4.2 Implement attack phase
│   ├── 4.3 Implement decay phase
│   ├── 4.4 Implement sustain level
│   ├── 4.5 Implement release phase
│   └── 4.6 Apply click-free gain ramps
│
├── 5. React Integration
│   ├── 5.1 Update Piano.jsx
│   ├── 5.2 Create synthesizer with useRef
│   ├── 5.3 Handle noteOn events
│   ├── 5.4 Handle noteOff events
│   ├── 5.5 Update active note state
│   ├── 5.6 Update PianoKey.jsx
│   ├── 5.7 Add pointer event handlers
│   └── 5.8 Highlight currently playing keys
│
├── 6. User Interface
│   ├── 6.1 Display active voice count
│   ├── 6.2 Display maximum voice limit
│   ├── 6.3 Display most recently stolen note
│   ├── 6.4 Add visual feedback for pressed keys
│   └── 6.5 Keep existing Task 1 piano layout
│
├── 7. Cleanup and Verification
│   ├── 7.1 Release oscillators on noteOff
│   ├── 7.2 Stop all voices when requested
│   ├── 7.3 Disconnect completed audio nodes
│   ├── 7.4 Close AudioContext on unmount
│   ├── 7.5 Verify simultaneous playback
│   ├── 7.6 Verify FIFO voice stealing
│   └── 7.7 Verify voice count never exceeds 8