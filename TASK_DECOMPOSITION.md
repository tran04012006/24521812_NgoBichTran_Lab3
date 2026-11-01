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