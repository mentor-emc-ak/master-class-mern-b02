import { useEffect, useReducer, useRef } from 'react';
import { useLogRender } from './DebugContext';

// Call this hook at the top of any component you want to track.
//
// Returns:
//   renderCount  — how many times this component has rendered (used as the
//                  CSS animation key so the flash restarts on every render)
//   forceRerender — call this to force this specific component to re-render
//                  (wired to the ↺ button in DebugOverlay)
export function useRenderTracker(name) {
  const logRender = useLogRender();

  // Sync increment — runs in the render body so it's ready immediately
  const countRef = useRef(0);
  countRef.current += 1;

  // dispatch() forces THIS component to re-render (used by the ↺ button)
  const [, forceRerender] = useReducer(n => n + 1, 0);

  // Log to context after React commits — no dep array = runs after every render
  useEffect(() => {
    logRender(name, countRef.current);
  });

  return { renderCount: countRef.current, forceRerender };
}
