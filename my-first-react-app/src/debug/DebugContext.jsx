import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';

// ─── Two separate contexts ────────────────────────────────────────────────────
//
// WHY TWO?
//   Context 1 (RenderLogContext) holds only the stable `logRender` function.
//   Components subscribe here. Because `logRender` never changes reference,
//   they never re-render due to debugger UI state (pause/step/highlight).
//
//   Context 2 (DebugUIContext) holds the live UI state that changes when you
//   click Pause/Next/Prev. Only DebugOverlay and RenderDebugger subscribe here.
//   This means stepping through renders does NOT cause components to flash.

const RenderLogContext = createContext(null);
const DebugUIContext   = createContext(null);

export const COLORS = {
  App:     '#7c3aed',
  Layout:  '#b45309',
  Navbar:  '#1d4ed8',
  Sidebar: '#15803d',
  Content: '#c2410c',
  RowList: '#b91c1c',
  Footer:  '#1e40af',
};

export function DebugProvider({ children }) {
  const [renderLog, setRenderLog] = useState([]);
  const [isPaused,  setIsPaused]  = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const idRef = useRef(0);

  // Stable forever — useCallback with empty deps + no captured state
  const logRender = useCallback((name, count) => {
    setRenderLog(prev => {
      const entry = { id: idRef.current++, component: name, count, color: COLORS[name] ?? '#888' };
      return [...prev.slice(-200), entry];
    });
  }, []);

  const togglePause = useCallback(() => setIsPaused(p => !p), []);
  const goNext      = useCallback(() => setStepIndex(i => i + 1), []);
  const goPrev      = useCallback(() => setStepIndex(i => Math.max(0, i - 1)), []);
  const clearLog    = useCallback(() => { setRenderLog([]); setStepIndex(0); }, []);

  const safeStep   = Math.min(stepIndex, Math.max(0, renderLog.length - 1));
  const highlighted = isPaused && renderLog.length > 0 ? renderLog[safeStep]?.component : null;

  const uiValue = useMemo(() => ({
    renderLog, isPaused, togglePause,
    stepIndex: safeStep, setStepIndex, goNext, goPrev,
    highlighted, clearLog,
  }), [renderLog, isPaused, togglePause, safeStep, goNext, goPrev, highlighted, clearLog]);

  return (
    <RenderLogContext.Provider value={logRender}>
      <DebugUIContext.Provider value={uiValue}>
        {children}
      </DebugUIContext.Provider>
    </RenderLogContext.Provider>
  );
}

export const useLogRender = () => useContext(RenderLogContext);
export const useDebugUI   = () => useContext(DebugUIContext);
