TASK 1: Project Setup & Data Normalization
│
├── 1.1 Initialize React Project
│   ├── Create Vite application
│   ├── Install React 19
│   └── Configure development environment
│
├── 1.2 Organize Project Structure
│   ├── Create components directory
│   ├── Create data directory
│   └── Create styles directory
│
├── 1.3 Normalize Scientist Dataset
│   ├── Define SMART_PEOPLE
│   ├── Assign stable unique IDs
│   ├── Standardize object properties
│   └── Export reusable constant
│
├── 1.4 Build Static Directory
│   ├── Create ScientistDirectory.jsx
│   ├── Import normalized data
│   ├── Render scientist records
│   └── Use stable React keys
│
├── 1.5 Integrate & Style
│   ├── Configure App.jsx
│   ├── Configure main.jsx
│   ├── Add basic styling
│   └── Verify browser output
│
└── 1.6 Git Version Control
    ├── Commit 1: React 19 project scaffold
    └── Commit 2: Normalize scientist data
TASK 2: INTERACTIVE SEARCH FUNCTIONALITY
│
├── 2.1 Understand React State
│   ├── Import useState from React
│   ├── Create query state
│   └── Connect the state to a text input
│
├── 2.2 Implement Search Input
│   ├── Create search form
│   ├── Add a controlled input
│   ├── Handle onChange events
│   └── Prevent unnecessary form submission
│
├── 2.3 Implement Case-Insensitive Search
│   ├── Normalize query with trim()
│   ├── Convert query to lowercase
│   ├── Convert scientist names to lowercase
│   └── Filter scientists using includes()
│
├── 2.4 Implement Derived State
│   ├── Calculate visiblePeople during render
│   ├── Avoid storing filtered results in useState
│   └── Avoid useEffect for filtering
│
├── 2.5 Display Search Results
│   ├── Render matching scientist cards
│   ├── Display result count
│   └── Handle empty results
│
├── 2.6 Update Accessibility & Styling
│   ├── Connect label and input using useId()
│   ├── Add accessible result count
│   ├── Preserve stable React keys
│   └── Style the search form and empty state
│
└── 2.7 Git Version Control
    ├── Commit 3: Controlled search input
    └── Commit 4: Derived filtering and result count
TASK 3: MINIMUM IQ NUMERIC FILTERING
│
├── 3.1 Review Existing Architecture
│   ├── Preserve the SMART_PEOPLE dataset
│   ├── Preserve query state
│   ├── Preserve case-insensitive search
│   └── Preserve accessible search controls
│
├── 3.2 Implement Minimum IQ Input
│   ├── Create minIq independent state
│   ├── Initialize minIq to 160
│   ├── Create an input with type="number"
│   ├── Connect input with useId()
│   ├── Handle onChange using valueAsNumber
│   └── Handle empty input values safely
│
├── 3.3 Implement Type-Safe Numeric Filtering
│   ├── Read the current minIq value
│   ├── Determine the effective IQ threshold
│   ├── Compare scientist IQ with >=
│   └── Preserve numeric comparisons
│
├── 3.4 Combine Search and IQ Conditions
│   ├── Normalize search query
│   ├── Check name matching
│   ├── Check minimum IQ
│   ├── Combine conditions using &&
│   └── Calculate visiblePeople during render
│
├── 3.5 Update the User Interface
│   ├── Display search and numeric controls
│   ├── Render filtered scientist cards
│   ├── Preserve live result count
│   ├── Display an empty-state message
│   └── Update responsive CSS
│
├── 3.6 Verify Functionality
│   ├── Test minimum IQ = 160
│   ├── Test minimum IQ = 200
│   ├── Test minimum IQ = 210
│   ├── Test minimum IQ = 220
│   ├── Test blank numeric input
│   ├── Test combined name and IQ filters
│   └── Test restoring the default threshold
│
└── 3.7 Git Version Control
    ├── Commit 5: Numeric IQ input and state
    └── Commit 6: Combined derived filtering
TASK 4: IQ SORTING & DERIVED STATE PIPELINE
│
├── 4.1 Review Existing Architecture
│   ├── Preserve normalized SMART_PEOPLE data
│   ├── Preserve query state
│   ├── Preserve minIq state
│   ├── Preserve accessible labels
│   └── Preserve live result count
│
├── 4.2 Add Sorting Controls
│   ├── Create sortBy state
│   ├── Set default value to "iq-desc"
│   ├── Generate an ID with useId()
│   ├── Create a controlled select input
│   ├── Add ascending IQ option
│   ├── Add descending IQ option
│   └── Connect onChange to setSortBy
│
├── 4.3 Implement Immutable Sorting
│   ├── Understand Array.sort() mutation
│   ├── Use ES2023 Array.toSorted()
│   ├── Implement ascending comparator
│   ├── Implement descending comparator
│   └── Avoid modifying SMART_PEOPLE
│
├── 4.4 Build Derived State Pipeline
│   ├── Normalize name query
│   ├── Calculate effective minimum IQ
│   ├── Filter by scientist name
│   ├── Filter by minimum IQ
│   ├── Sort filtered scientists
│   └── Return visiblePeople
│
├── 4.5 Update Interface
│   ├── Display search input
│   ├── Display minimum IQ input
│   ├── Display sorting dropdown
│   ├── Render sorted scientist cards
│   ├── Preserve empty-state message
│   └── Update responsive layout
│
├── 4.6 Verify Functionality
│   ├── Test descending IQ sorting
│   ├── Test ascending IQ sorting
│   ├── Test combined search and sorting
│   ├── Test combined IQ filter and sorting
│   ├── Test all three controls together
│   ├── Verify original data is unchanged
│   └── Run production build
│
└── 4.7 Git Version Control
    ├── Commit 7: Add controlled sort selector
    └── Commit 8: Implement immutable derived sorting
TASK 5: IMMUTABLE DELETE & RESET
│
├── 5.1 Review Existing Architecture
│   ├── Preserve React 19
│   ├── Preserve SMART_PEOPLE
│   ├── Preserve query state
│   ├── Preserve minIq state
│   ├── Preserve sortBy state
│   └── Preserve derived-state pipeline
│
├── 5.2 Introduce Scientist Collection State
│   ├── Create people state
│   ├── Initialize from SMART_PEOPLE
│   ├── Keep original data unchanged
│   └── Derive visiblePeople from people
│
├── 5.3 Implement Immutable Deletion
│   ├── Create handleDelete(id)
│   ├── Use functional state update
│   ├── Remove by stable ID
│   ├── Preserve other scientists
│   └── Add Delete button to each card
│
├── 5.4 Implement Reset
│   ├── Create handleReset()
│   ├── Restore original scientists
│   ├── Clear search query
│   ├── Restore minimum IQ to 160
│   └── Restore descending sorting
│
├── 5.5 Accessibility
│   ├── Use native button elements
│   ├── Add descriptive aria-labels
│   ├── Preserve stable React keys
│   ├── Preserve live result count
│   └── Preserve visible keyboard focus
│
├── 5.6 Styling
│   ├── Create Delete button styles
│   ├── Create Reset button styles
│   ├── Maintain responsive layout
│   └── Add hover and focus styles
│
├── 5.7 Verification
│   ├── Delete one scientist
│   ├── Verify only that scientist disappears
│   ├── Delete while filters are active
│   ├── Verify original data is unchanged
│   ├── Reset after deletion
│   ├── Verify search and filters reset
│   ├── Check production build
│   └── Check Git history
│
└── 5.8 Git Version Control
    ├── Commit 9: Immutable deletion
TASK 6: ACCESSIBILITY & FINAL VERIFICATION
│
├── 6.1 Review Existing Functionality
│   ├── Verify name search
│   ├── Verify numeric IQ filtering
│   ├── Verify ascending/descending sorting
│   ├── Verify immutable deletion
│   ├── Verify Reset
│   └── Verify live result count
│
├── 6.2 Improve Keyboard Accessibility
│   ├── Preserve native input controls
│   ├── Preserve accessible labels
│   ├── Preserve visible focus indicators
│   ├── Support Enter and Space for buttons
│   └── Verify keyboard navigation order
│
├── 6.3 Manage Focus After Deletion
│   ├── Add a ref for the scientist list
│   ├── Track the position of the deleted card
│   ├── Delete using stable scientist IDs
│   ├── Focus the next remaining Delete button
│   ├── Fall back to the previous button
│   └── Focus Reset when no results remain
│
├── 6.4 Verify Screen Reader Accessibility
│   ├── Preserve useId() labels
│   ├── Preserve aria-label on Delete buttons
│   ├── Preserve live result count
│   ├── Announce deletion results
│   └── Avoid unnecessary announcements
│
├── 6.5 Configure Automated Testing
│   ├── Install Vitest
│   ├── Install React Testing Library
│   ├── Install user-event
│   ├── Configure jsdom
│   ├── Configure jest-dom matchers
│   └── Add npm test script
│
├── 6.6 Implement Automated Tests
│   ├── Test initial scientist records
│   ├── Test case-insensitive search
│   ├── Test minimum IQ filtering
│   ├── Test ascending/descending sorting
│   ├── Test immutable deletion
│   ├── Test focus preservation
│   ├── Test Reset
│   ├── Test accessible labels
│   └── Test render commits
│
├── 6.7 Final Verification
│   ├── Run automated tests
│   ├── Run production build
│   ├── Test keyboard navigation manually
│   ├── Inspect browser console
│   ├── Inspect Git history
│   └── Verify 12 meaningful commits
│
└── 6.8 Git Version Control
    ├── Commit 11: Accessibility improvements
    └── Commit 12: Automated tests and verification