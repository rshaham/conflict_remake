---
description: Create a new game screen with proper structure and routing
allowed-tools: Read, Write, Glob, Bash
---

# Add Screen: $ARGUMENTS

Create a new screen for the Conflict game. The argument should be the screen name (e.g., "Nuclear" or "Advisors").

## Screen Architecture

Screens are full-page views in `src/screens/`. They:
- Are mobile-first (portrait orientation)
- Connect to Zustand store for state
- Use components from `src/components/`
- Follow consistent layout patterns

## Steps

### 1. Create Screen File

Create `src/screens/{ScreenName}Screen.tsx`:

```tsx
import { useGameStore } from '../store/gameStore';
import { NavBar } from '../components/layout/NavBar';
import { StatusBar } from '../components/layout/StatusBar';

interface {ScreenName}ScreenProps {
  // Add any route params here
}

export function {ScreenName}Screen({}: {ScreenName}ScreenProps) {
  // Connect to store
  const gameState = useGameStore((state) => state.gameState);
  
  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Status bar at top */}
      <StatusBar 
        month={gameState.month}
        year={gameState.year}
        budget={gameState.player.budget}
      />
      
      {/* Main content area - scrollable */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Screen content here */}
        <h1 className="text-xl font-bold text-white mb-4">
          {ScreenName}
        </h1>
        
        {/* TODO: Add screen-specific content */}
      </main>
      
      {/* Navigation at bottom */}
      <NavBar currentScreen="{screenName}" />
    </div>
  );
}
```

### 2. Add Route

Update `src/App.tsx` to include the new route:

```tsx
import { {ScreenName}Screen } from './screens/{ScreenName}Screen';

// In router configuration:
{
  path: '/{screenName}',
  element: <{ScreenName}Screen />,
}
```

### 3. Add to Navigation

If this screen should appear in the main nav, update `src/components/layout/NavBar.tsx`:

```tsx
const NAV_ITEMS = [
  // ... existing items
  { id: '{screenName}', label: '{Screen Name}', icon: '{IconName}' },
];
```

### 4. Create Supporting Components

If the screen needs unique components, create them in `src/components/game/`:

```
src/components/game/
├── {ScreenName}Card.tsx
├── {ScreenName}List.tsx
└── {ScreenName}Modal.tsx
```

### 5. Mobile-First Checklist

Verify the screen follows mobile-first principles:

- [ ] Touch targets minimum 44×44px
- [ ] No hover-dependent interactions
- [ ] Bottom navigation (thumb-friendly)
- [ ] Scrollable content area
- [ ] Text readable without zooming (min 14px)
- [ ] No horizontal scrolling required

### 6. Connect to Game State

Identify what state the screen needs and add selectors:

```tsx
// Efficient selectors - only re-render when needed
const specificData = useGameStore((state) => state.gameState?.specificField);

// Or use shallow equality for objects
import { shallow } from 'zustand/shallow';
const { a, b } = useGameStore(
  (state) => ({ a: state.a, b: state.b }),
  shallow
);
```

### 7. Add Loading/Error States

Every screen should handle:
- Loading state (while data fetches)
- Error state (if something fails)
- Empty state (if no data to display)

### 8. Summary

Output what was created:
- Screen file path
- Route added
- Components created
- Navigation updated
