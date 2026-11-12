+-- Task 1: Project Setup & PUBG Arena Foundation
|   |
|   +-- 1.1 Initialize Project
|   |   +-- Create Vite + React application
|   |   +-- Install React 19 dependencies
|   |   +-- Configure project scripts
|   |   +-- Configure .gitignore
|   |
|   +-- 1.2 Define Data Contracts
|   |   +-- Define PubgCrateDrop interface
|   |   +-- Define PubgVnSquadStanding interface
|   |   +-- Create mock airdrop data
|   |   +-- Create mock squad standings
|   |
|   +-- 1.3 Build Initial Components
|   |   +-- Header
|   |   +-- AirdropCountdown
|   |   +-- RewardClaimCard
|   |   +-- Leaderboard
|   |
|   +-- 1.4 Build Main Dashboard
|   |   +-- Assemble components in App.jsx
|   |   +-- Implement PUBG-inspired styling
|   |   +-- Add responsive layouts
|   |
|   +-- 1.5 Verify Task 1
|       +-- Verify React 19 installation
|       +-- Verify development server starts
|       +-- Verify mock data renders
|       +-- Verify no console errors
|       +-- Commit 1: Project initialization
|       +-- Commit 2: Contracts, mock data and UI
+-- Task 2: Anti-Drift Airdrop Timer [IN PROGRESS]
|   |
|   +-- 2.1 Timer Utilities
|   |   +-- Create src/utils/timerUtils.js
|   |   +-- Validate targetEpochMs
|   |   +-- Calculate remaining milliseconds
|   |   +-- Apply serverOffsetMs
|   |   +-- Convert milliseconds to HH:MM:SS
|   |   +-- Clamp remaining time to zero
|   |
|   +-- 2.2 Create Countdown Hook
|   |   +-- Create src/hooks/usePubgAirdropTimer.js
|   |   +-- Import useState
|   |   +-- Import useEffect
|   |   +-- Import useCallback
|   |   +-- Calculate time from absolute deadline
|   |   +-- Start 200ms display refresh interval
|   |   +-- Handle target deadline changes
|   |   +-- Handle server offset changes
|   |   +-- Stop timer after expiration
|   |
|   +-- 2.3 Handle Browser Visibility
|   |   +-- Listen for visibilitychange
|   |   +-- Recalculate when tab becomes visible
|   |   +-- Listen for window focus
|   |   +-- Clean up event listeners
|   |   +-- Clean up interval on unmount
|   |
|   +-- 2.4 Integrate Countdown Component
|   |   +-- Update AirdropCountdown.jsx
|   |   +-- Replace static placeholders
|   |   +-- Display live hours
|   |   +-- Display live minutes
|   |   +-- Display live seconds
|   |   +-- Show expired state
|   |   +-- Add accessible countdown label
|   |
|   +-- 2.5 Verify Timer Behavior
|       +-- Test initial countdown
|       +-- Test background tab recovery
|       +-- Test zero boundary
|       +-- Test changed deadlines
|       +-- Test server clock offset
|       +-- Test interval cleanup
|       +-- Commit 3: Timer utilities and hook
|       +-- Commit 4: Countdown UI integration
+-- Task 3: Optimistic Claim & HTTP 409 Rollback [IN PROGRESS]
|   |
|   +-- 3.1 Create Mock Claim Service
|   |   +-- Create src/services/pubgClaimApi.js
|   |   +-- Maintain server-authoritative stock
|   |   +-- Simulate asynchronous requests
|   |   +-- Validate claim requests
|   |   +-- Return successful claim responses
|   |   +-- Return HTTP 409 conflicts
|   |   +-- Support simulated conflict testing
|   |   +-- Support request cancellation
|   |
|   +-- 3.2 Implement Optimistic Claim Hook
|   |   +-- Create src/hooks/useOptimisticClaim.js
|   |   +-- Store visible inventory
|   |   +-- Store pending request state
|   |   +-- Store claim feedback
|   |   +-- Deduct inventory immediately
|   |   +-- Prevent duplicate submissions
|   |   +-- Await asynchronous API response
|   |   +-- Reconcile successful server response
|   |   +-- Handle HTTP 409 conflicts
|   |   +-- Restore stock on failure
|   |   +-- Clean up pending requests
|   |
|   +-- 3.3 Update Reward Claim UI
|   |   +-- Enable CLAIM button
|   |   +-- Display optimistic stock
|   |   +-- Display claiming status
|   |   +-- Display success feedback
|   |   +-- Display HTTP 409 error feedback
|   |   +-- Add conflict simulation control
|   |   +-- Disable duplicate clicks
|   |
|   +-- 3.4 Update Application Styles
|   |   +-- Pending button styles
|   |   +-- Success message styles
|   |   +-- Error message styles
|   |   +-- Conflict simulation controls
|   |
|   +-- 3.5 Verify Claim Behavior
|       +-- Test successful claim
|       +-- Test immediate stock deduction
|       +-- Test duplicate-click prevention
|       +-- Test HTTP 409 rollback
|       +-- Test stock reaching zero
|       +-- Test independent reward cards
|       +-- Verify React 19 build
|       +-- Commit 5: Claim service and hook
|       +-- Commit 6: Reward UI and integration
+-- Task 5: Accessibility & Performance [IN PROGRESS]
|   |
|   +-- 5.1 Accessibility Foundation
|   |   |
|   |   +-- Add skip-to-content navigation
|   |   +-- Add meaningful focus destinations
|   |   +-- Improve visible keyboard focus
|   |   +-- Respect reduced-motion settings
|   |   +-- Support high-contrast preferences
|   |
|   +-- 5.2 Virtualization Improvements
|   |   |
|   |   +-- Measure actual viewport height
|   |   +-- Observe container resize
|   |   +-- Clamp scroll position
|   |   +-- Reset scroll when query changes
|   |   +-- Support keyboard scroll commands
|   |   +-- Preserve correct spacer heights
|   |   +-- Clean up observers
|   |
|   +-- 5.3 React Rendering Performance
|   |   |
|   |   +-- Extract memoized leaderboard rows
|   |   +-- Keep stable row properties
|   |   +-- Memoize filtering and sorting
|   |   +-- Use deferred search values
|   |   +-- Avoid unnecessary callback changes
|   |
|   +-- 5.4 Leaderboard Accessibility
|   |   |
|   |   +-- Label all filter controls
|   |   +-- Announce result counts
|   |   +-- Announce active sort options
|   |   +-- Provide keyboard scroll instructions
|   |   +-- Provide meaningful empty states
|   |   +-- Maintain accessible table structure
|   |
|   +-- 5.5 Kill-Feed Accessibility
|   |   |
|   |   +-- Improve event descriptions
|   |   +-- Add screen-reader result status
|   |   +-- Support keyboard scrolling
|   |   +-- Improve reset controls
|   |   +-- Handle empty results
|   |
|   +-- 5.6 Countdown & Claim Feedback
|   |   |
|   |   +-- Announce expiration once
|   |   +-- Avoid announcements every second
|   |   +-- Improve claim button labels
|   |   +-- Improve pending feedback
|   |   +-- Improve conflict feedback
|   |   +-- Preserve optimistic behavior
|   |
|   +-- 5.7 Responsive Improvements
|   |   |
|   |   +-- Improve filter layouts
|   |   +-- Support small mobile screens
|   |   +-- Support horizontal table scrolling
|   |   +-- Preserve keyboard focus visibility
|   |
|   +-- 5.8 Verification
|       |
|       +-- Test keyboard navigation
|       +-- Test virtual scroll resizing
|       +-- Test filtering and sorting
|       +-- Test claim and timer regressions
|       +-- Test reduced motion
|       +-- Test production build
|       |
|       +-- Commit 9: Accessibility foundation
|       +-- Commit 10: Performance and responsive UI