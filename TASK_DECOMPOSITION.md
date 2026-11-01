# Exercise 3 — Task 1: Project Setup

Initialize a React 19 application for the KRAFTON PUBG
Vietnam Series Live Telemetry Dashboard.

## Task Breakdown

### 1. Project initialization
- Configure Vite with React 19.
- Configure the application entry point.
- Create the root App component.

### 2. Telemetry dataset
- Create a simulated dataset of four PUBG squads.
- Include squad ID, name, map, phase, alive,
  kills, WWCD probability, and status.
- Export the dataset for reuse.

### 3. Initial dashboard
- Create the PubgMatchTelemetry component.
- Display the available teams.
- Display match statistics using static data.
- Prepare the interface for later state management.

### 4. Styling
- Create a dark esports-themed interface.
- Make the dashboard responsive.
- Use reusable CSS classes.

## Task 2 — Four-State Machine 

### Task 2.1 — State Management

- Create the four-state model.
- Implement a reusable custom hook.
- Simulate asynchronous telemetry requests.
- Separate fetching logic from rendering logic.
- Show the correct UI for every state.

### Task 2.2 — Squad Selector and UI
- Render four squads as buttons.
- Track the selected squad using useState.
- Load telemetry when a squad is selected.
- Display loading and success states.
- Provide an accessible error state.
- Maintain responsive styling.

## Task 3 — AbortController

### Task 3.1 — Service Layer
- Accept an AbortSignal.
- Cancel simulated network timers on abort.
- Reject aborted requests with AbortError.
- Simulate 35% request failure for
  Erangel and Miramar.
- Return a fresh copy of squad data.
- Log request start, success, failure,
  and cancellation for debugging.
  ### Task 3.2 — Hook Integration

- Create AbortController inside useEffect.
- Pass signal to the telemetry service.
- Abort previous requests during cleanup.
- Ignore AbortError.
- Maintain four-state lifecycle.
- Prevent obsolete requests from updating UI.
- Preserve the selected squad when loading.


## Task 4 — Skeleton and Retry [Current]

### Objective
Provide stable loading feedback and accessible
recovery when telemetry requests fail.

### Task 4.1 — Blue-Zone Skeleton

- Render a loading skeleton during LOADING.
- Set skeleton height to exactly 220px.
- Add a blue pulsating CSS animation.
- Avoid loading-state layout collapse.
- Respect prefers-reduced-motion.
- Mark decorative shapes aria-hidden.

### Task 4.2 — Error Recovery

- Render an accessible error message.
- Use role="alert" for request failures.
- Add Reconnect Satellite button.
- Implement retryTick state.
- Re-run useEffect when retryTick changes.
- Abort the previous request during cleanup.
- Clear previous errors before retrying.
- Do not use window.alert().
## Task 5 — Accessibility and Responsive UI [Current]

### 5.1 Accessibility

- Use semantic button elements.
- Announce status updates using aria-live.
- Set aria-busy during loading.
- Maintain aria-pressed for selected squads.
- Use role=alert for request errors.
- Provide meaningful accessible labels.
- Keep decorative skeleton elements hidden.
- Avoid duplicate loading announcements.
- Preserve logical keyboard focus.

### 5.2 Responsive Design

- Improve focus-visible styling.
- Improve responsive grid behavior.
- Preserve a 220px skeleton.
- Reduce layout movement.
- Provide readable text contrast.
- Support reduced-motion preferences.
- Prevent horizontal overflow at 320px.