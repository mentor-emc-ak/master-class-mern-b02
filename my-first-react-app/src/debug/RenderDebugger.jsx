import { useEffect } from 'react';
import { useDebugUI, COLORS } from './DebugContext';

export function RenderDebugger() {
  const {
    renderLog, isPaused, togglePause,
    stepIndex, setStepIndex, goNext, goPrev,
    highlighted, clearLog,
  } = useDebugUI();

  // When pausing, jump to the most recent log entry so student sees current state
  useEffect(() => {
    if (isPaused && renderLog.length > 0) {
      setStepIndex(renderLog.length - 1);
    }
  }, [isPaused]);

  const currentEntry = isPaused && renderLog.length > 0
    ? renderLog[Math.min(stepIndex, renderLog.length - 1)]
    : null;

  // Latest render count per component for the summary chips
  const summary = renderLog.reduce((acc, e) => { acc[e.component] = e.count; return acc; }, {});

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      background: '#1e1e2e', color: '#cdd6f4',
      borderRadius: 14, padding: 16, width: 300,
      boxShadow: '0 12px 48px #00000099',
      fontFamily: 'ui-monospace, Consolas, monospace',
      fontSize: 12, zIndex: 9999,
      border: '1px solid #313244',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#cba6f7' }}>⚛ Render Debugger</span>
        <button onClick={clearLog} style={chip('#313244')}>Clear</button>
      </div>

      {/* ── Component summary chips ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {Object.keys(COLORS).map(name =>
          summary[name] ? (
            <span key={name} style={{
              borderRadius: 999, padding: '1px 8px', fontWeight: 700,
              border: `1px solid ${COLORS[name]}88`,
              background: highlighted === name ? COLORS[name] : COLORS[name] + '22',
              color:      highlighted === name ? '#fff'        : COLORS[name],
              transition: 'background 0.2s, color 0.2s',
            }}>
              {name} ×{summary[name]}
            </span>
          ) : null
        )}
        {Object.keys(summary).length === 0 && (
          <span style={{ color: '#6c7086', fontStyle: 'italic' }}>No renders yet</span>
        )}
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={goPrev}
          disabled={!isPaused || stepIndex <= 0}
          style={chip('#313244', !isPaused || stepIndex <= 0)}
        >
          ⏮ Prev
        </button>
        <button
          onClick={togglePause}
          style={{
            ...chip(isPaused ? '#a6e3a1' : '#f38ba8'),
            color: '#1e1e2e', fontWeight: 800, flex: 1,
          }}
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
        <button
          onClick={goNext}
          disabled={!isPaused || stepIndex >= renderLog.length - 1}
          style={chip('#313244', !isPaused || stepIndex >= renderLog.length - 1)}
        >
          Next ⏭
        </button>
      </div>

      {/* ── Current step indicator ───────────────────────────────────────── */}
      {currentEntry && (
        <div style={{
          background: '#313244', borderRadius: 8, padding: '8px 12px',
          textAlign: 'center', border: `1px solid ${currentEntry.color}55`,
        }}>
          <span style={{ color: currentEntry.color, fontWeight: 800, fontSize: 14 }}>
            {currentEntry.component}
          </span>
          {' '}
          <span style={{ color: '#a6adc8' }}>rendered ×{currentEntry.count}</span>
          <div style={{ color: '#6c7086', fontSize: 11, marginTop: 3 }}>
            Step {stepIndex + 1} / {renderLog.length}
          </div>
        </div>
      )}

      {/* ── Render log ──────────────────────────────────────────────────── */}
      <div style={{ maxHeight: 190, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {renderLog.length === 0 && (
          <div style={{ color: '#6c7086', textAlign: 'center', padding: 20, fontStyle: 'italic', lineHeight: 1.6 }}>
            Click ↺ on any component<br />or change the multiplier<br />to see renders appear here
          </div>
        )}
        {[...renderLog].reverse().map((entry, rev) => {
          const origIdx = renderLog.length - 1 - rev;
          const isStep  = isPaused && origIdx === stepIndex;
          return (
            <div
              key={entry.id}
              onClick={() => isPaused && setStepIndex(origIdx)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '3px 8px', borderRadius: 6,
                background: isStep ? '#313244' : 'transparent',
                border: `1px solid ${isStep ? entry.color + '55' : 'transparent'}`,
                cursor: isPaused ? 'pointer' : 'default',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
              <span style={{ color: entry.color, fontWeight: 600, flex: 1 }}>{entry.component}</span>
              <span style={{ color: '#6c7086' }}>×{entry.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function chip(bg, disabled = false) {
  return {
    background: bg, border: '1px solid #45475a',
    color: '#cdd6f4', borderRadius: 8,
    padding: '4px 10px', fontSize: 11, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1,
  };
}
