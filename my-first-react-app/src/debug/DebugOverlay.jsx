import { useDebugUI, COLORS } from './DebugContext';

// Place <DebugOverlay /> as the FIRST child inside a `position: relative`
// container. It renders three things:
//   1. A flash border that animates on every render  (keyed to renderCount)
//   2. A pulsing glow when this component is the active step in the debugger
//   3. A render-count badge (top-right) + a force-rerender button (top-left)
//
// DebugOverlay subscribes to DebugUIContext — NOT to the component's context —
// so updating the step/highlight does NOT cause the parent component to re-render.
export function DebugOverlay({ name, renderCount, onRerender }) {
  const { highlighted } = useDebugUI();
  const color = COLORS[name] ?? '#888';
  const isHighlighted = highlighted === name;

  return (
    <>
      {/* ── Flash border ────────────────────────────────────────────────────
          key={renderCount} causes React to unmount + remount this div on
          every render, which restarts the CSS animation from 0%.          */}
      <div
        key={renderCount}
        style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          border: `3px solid ${color}`,
          animation: 'render-flash 0.7s ease-out forwards',
          pointerEvents: 'none', zIndex: 50,
        }}
      />

      {/* ── Step highlight glow ─────────────────────────────────────────── */}
      {isHighlighted && (
        <div style={{
          position: 'absolute', inset: -3, borderRadius: 'inherit',
          boxShadow: `0 0 0 3px ${color}, 0 0 24px ${color}99`,
          animation: 'highlight-pulse 1.2s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 49,
        }} />
      )}

      {/* ── Render count badge (top-right) ──────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 6, right: 6,
        background: color, color: '#fff',
        borderRadius: 999, padding: '0 7px', lineHeight: '20px',
        fontSize: 11, fontWeight: 800, fontFamily: 'monospace',
        zIndex: 60, boxShadow: '0 1px 4px #0004',
        userSelect: 'none',
      }}>
        ×{renderCount}
      </div>

      {/* ── Force-rerender button (top-left) ────────────────────────────── */}
      <button
        onClick={e => { e.stopPropagation(); onRerender(); }}
        title={`Force re-render ${name}`}
        style={{
          position: 'absolute', top: 6, left: 6,
          background: color, color: '#fff',
          border: 'none', borderRadius: 999,
          padding: '0 8px', lineHeight: '20px',
          fontSize: 13, fontWeight: 700,
          cursor: 'pointer', zIndex: 60,
          boxShadow: '0 1px 4px #0004',
        }}
      >
        ↺
      </button>
    </>
  );
}
