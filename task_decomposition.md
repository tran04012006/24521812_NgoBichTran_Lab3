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