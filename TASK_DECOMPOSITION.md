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