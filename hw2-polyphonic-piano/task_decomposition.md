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
Task 4
│
├── 1. Recording Data Model
│   ├── 1.1 Define recording event structure
│   │   ├── midi
│   │   ├── freqHz
│   │   ├── durationMs
│   │   └── deltaMs
│   ├── 1.2 Track note start timestamps
│   ├── 1.3 Track note end timestamps
│   ├── 1.4 Calculate note durations
│   └── 1.5 Calculate delta times
│
├── 2. Sequencer Class
│   ├── 2.1 Create src/sequencer/Sequencer.js
│   ├── 2.2 Implement startRecording()
│   ├── 2.3 Implement recordNoteOn()
│   ├── 2.4 Implement recordNoteOff()
│   ├── 2.5 Implement stopRecording()
│   ├── 2.6 Store recorded events
│   └── 2.7 Export recorded events
│
├── 3. FIFO Playback
│   ├── 3.1 Read recorded events in order
│   ├── 3.2 Reconstruct relative start times
│   ├── 3.3 Schedule asynchronous note starts
│   ├── 3.4 Schedule independent note releases
│   ├── 3.5 Preserve overlapping notes
│   ├── 3.6 Support repeated MIDI notes
│   └── 3.7 Finish playback after final release
│
├── 4. Playback Speed
│   ├── 4.1 Support 0.5x speed
│   ├── 4.2 Support 1x speed
│   ├── 4.3 Support 2x speed
│   ├── 4.4 Scale delta times
│   └── 4.5 Scale note durations
│
├── 5. Playback Cancellation
│   ├── 5.1 Track playback AbortController
│   ├── 5.2 Cancel pending note starts
│   ├── 5.3 Cancel pending note releases
│   ├── 5.4 Release playback-owned notes
│   └── 5.5 Prevent canceled notes from restarting
│
├── 6. React Integration
│   ├── 6.1 Update Piano.jsx
│   ├── 6.2 Initialize Sequencer
│   ├── 6.3 Connect recording to note ownership
│   ├── 6.4 Connect playback to PolyphonicSynth
│   ├── 6.5 Preserve manual input ownership
│   ├── 6.6 Implement recording state
│   ├── 6.7 Implement playback state
│   └── 6.8 Clean up on component unmount
│
├── 7. User Interface
│   ├── 7.1 Create RecorderControls.jsx
│   ├── 7.2 Create RecorderControls.css
│   ├── 7.3 Add Start Recording button
│   ├── 7.4 Add Stop Recording button
│   ├── 7.5 Add Play button
│   ├── 7.6 Add Stop Playback button
│   ├── 7.7 Add playback speed selector
│   ├── 7.8 Display recorded events
│   └── 7.9 Display current sequencer status
│
├── 8. Testing
│   ├── 8.1 Test recording a single note
│   ├── 8.2 Test recording a melody
│   ├── 8.3 Test recording a chord
│   ├── 8.4 Test FIFO order
│   ├── 8.5 Test playback at 0.5x
│   ├── 8.6 Test playback at 1x
│   ├── 8.7 Test playback at 2x
│   ├── 8.8 Test Stop Playback
│   ├── 8.9 Test concurrent manual input
│   └── 8.10 Verify production build
Task 5
│
├── 1. Playback Cancellation
│   ├── 1.1 Improve AbortController management
│   ├── 1.2 Cancel pending playback delays
│   ├── 1.3 Prevent notes starting after cancellation
│   ├── 1.4 Release playback-owned notes
│   ├── 1.5 Support repeated cancellation
│   ├── 1.6 Prevent concurrent playback sessions
│   └── 1.7 Clean up after playback errors
│
├── 2. Audio Engine Cleanup
│   ├── 2.1 Track allocated audio voices
│   ├── 2.2 Track released oscillators
│   ├── 2.3 Implement immediate stopAll
│   ├── 2.4 Disconnect completed audio nodes
│   ├── 2.5 Prevent duplicate oscillator.stop calls
│   ├── 2.6 Close AudioContext on disposal
│   └── 2.7 Preserve FIFO voice stealing
│
├── 3. React Lifecycle
│   ├── 3.1 Preserve synthesizer with useRef
│   ├── 3.2 Preserve sequencer with useRef
│   ├── 3.3 Support React 19 Strict Mode
│   ├── 3.4 Remove global event listeners
│   ├── 3.5 Cancel playback on unmount
│   └── 3.6 Prevent state updates after unmount
│
├── 4. Accessibility
│   ├── 4.1 Improve accessible button labels
│   ├── 4.2 Add keyboard navigation
│   ├── 4.3 Support ArrowLeft and ArrowRight
│   ├── 4.4 Support Home and End
│   ├── 4.5 Preserve Enter and Space activation
│   ├── 4.6 Add screen-reader status announcements
│   └── 4.7 Preserve visible focus indicators
│
├── 5. React Optimization
│   ├── 5.1 Preserve React.memo for PianoKey
│   ├── 5.2 Use useCallback for note handlers
│   ├── 5.3 Keep static piano data outside render
│   ├── 5.4 Avoid unnecessary state updates
│   ├── 5.5 Keep audio objects outside React state
│   └── 5.6 Verify rendering using React DevTools
│
├── 6. Integration
│   ├── 6.1 Update PolyphonicSynth.js
│   ├── 6.2 Update Sequencer.js
│   ├── 6.3 Update PianoKey.jsx
│   ├── 6.4 Update Piano.jsx
│   ├── 6.5 Preserve KeyboardGuide.jsx
│   ├── 6.6 Preserve RecorderControls.jsx
│   └── 6.7 Preserve existing CSS
│
├── 7. Verification
│   ├── 7.1 Test immediate Stop Playback
│   ├── 7.2 Test Stop All Notes
│   ├── 7.3 Test overlapping notes
│   ├── 7.4 Test repeated MIDI notes
│   ├── 7.5 Test 8-voice FIFO limit
│   ├── 7.6 Test window blur
│   ├── 7.7 Test keyboard accessibility
│   ├── 7.8 Test React rendering
│   ├── 7.9 Test component unmount
│   └── 7.10 Verify production build