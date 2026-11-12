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
Task 3
│
├── 1. Physical Keyboard Mapping
│   ├── 1.1 Create keyboardMapping.js
│   ├── 1.2 Define physical key-to-MIDI mapping
│   ├── 1.3 Map 17 keys from C4 to E5
│   ├── 1.4 Use KeyboardEvent.code
│   └── 1.5 Export mapping for reuse
│
├── 2. Keyboard Event Handling
│   ├── 2.1 Register keydown listener
│   ├── 2.2 Register keyup listener
│   ├── 2.3 Prevent auto-repeat
│   ├── 2.4 Ignore typing in form controls
│   ├── 2.5 Ignore modified shortcuts
│   ├── 2.6 Handle window blur
│   └── 2.7 Remove listeners on unmount
│
├── 3. Pointer Event Handling
│   ├── 3.1 Handle pointerdown
│   ├── 3.2 Handle pointerup
│   ├── 3.3 Handle pointercancel
│   ├── 3.4 Handle lostpointercapture
│   ├── 3.5 Support independent pointer IDs
│   └── 3.6 Release notes safely
│
├── 4. Input Ownership
│   ├── 4.1 Track note owners using Map and Set
│   ├── 4.2 Identify computer keyboard input sources
│   ├── 4.3 Identify mouse and touch input sources
│   ├── 4.4 Support multiple owners per MIDI note
│   ├── 4.5 Start audio only for the first owner
│   ├── 4.6 Stop audio when the last owner releases
│   ├── 4.7 Handle notes removed by FIFO stealing
│   └── 4.8 Clear owners on Stop All
│
├── 5. React Integration
│   ├── 5.1 Update Piano.jsx
│   ├── 5.2 Update PianoKey.jsx
│   ├── 5.3 Preserve PolyphonicSynth instance
│   ├── 5.4 Keep event callbacks stable
│   ├── 5.5 Synchronize active note state
│   └── 5.6 Preserve React.memo optimization
│
├── 6. Keyboard Guide UI
│   ├── 6.1 Create KeyboardGuide.jsx
│   ├── 6.2 Create KeyboardGuide.css
│   ├── 6.3 Display physical key labels
│   ├── 6.4 Display corresponding piano notes
│   └── 6.5 Highlight currently active notes
│
├── 7. Verification
│   ├── 7.1 Test computer keyboard input
│   ├── 7.2 Test simultaneous keyboard notes
│   ├── 7.3 Test keyboard auto-repeat prevention
│   ├── 7.4 Test keyboard and mouse on same note
│   ├── 7.5 Test multiple touch inputs
│   ├── 7.6 Test window focus loss
│   ├── 7.7 Test FIFO voice stealing
│   ├── 7.8 Test Stop All
│   └── 7.9 Verify production build