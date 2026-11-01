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
