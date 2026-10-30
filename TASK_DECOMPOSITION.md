# Exercise 1 — Task Decomposition

## Project Rules

1. Use React 19.
2. Create more than 10 atomic commits across Exercise 1.
3. Write task decomposition before implementation.
4. Provide the full content of all created or modified files.
5. Do not use div elements inside DeveloperCard.jsx.

## Task 1: React Foundation & Semantic Components

### Objective

Create a React 19 application that displays a
Developer and Pro-Gamer profile using semantic HTML.

### Step 1.1 — Initialize React 19

- [ ] Create a Vite React project.
- [ ] Install React 19 and React DOM 19.
- [ ] Verify the React version.
- [ ] Configure the application entry point.

### Step 1.2 — Create DeveloperCard

- [ ] Create DeveloperCard.jsx.
- [ ] Use article for the profile container.
- [ ] Use header and hgroup for profile identity.
- [ ] Use dl, dt and dd for profile information.
- [ ] Avoid all div elements.

### Step 1.3 — Create SkillBadge

- [ ] Create SkillBadge.jsx.
- [ ] Accept skill information through props.
- [ ] Render a semantic list of skills.
- [ ] Use React keys when rendering arrays.

### Step 1.4 — Integration

- [ ] Import DeveloperCard into App.jsx.
- [ ] Render the card successfully.
- [ ] Verify that the components work together.

### Step 1.5 — Verification

- [ ] Run npm run dev.
- [ ] Run npm run build.
- [ ] Verify zero div elements in DeveloperCard.jsx.
- [ ] Inspect the browser Accessibility Tree.

## Task 1 Git Commits

1. chore(ex1): initialize React 19 project
2. feat(ex1): implement semantic DeveloperCard
3. feat(ex1): extract reusable SkillBadge

## Definition of Done

- React 19 is installed.
- DeveloperCard renders successfully.
- SkillBadge renders all skills.
- Semantic HTML requirements are satisfied.
- No div tags appear in DeveloperCard.jsx.
- The production build succeeds.