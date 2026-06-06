import React, { useState, useMemo, useCallback } from 'react';
import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

const ROWS = Array.from({ length: 1_000_000 }, (_, i) => i + 1);

// ─── RowList ─────────────────────────────────────────────────────────────────
// React.memo: only re-renders when `multiplier` prop changes.
// Clicking ↺ on RowList forces IT to re-render (internal state change bypasses memo).
// Clicking ↺ on Content does NOT re-render RowList (multiplier didn't change).
const RowList = React.memo(function RowList({ multiplier }) {
  const { renderCount, forceRerender } = useRenderTracker('RowList');

  console.log('🟢 RowList rendering — multiplier:', multiplier);

  return (
    <div className="relative border-2 border-red-400 rounded-xl bg-orange-100 p-3">
      <DebugOverlay name="RowList" renderCount={renderCount} onRerender={forceRerender} />

      <p className="text-red-500 text-center font-semibold mb-2 text-sm">
        10,00,000 rows{' '}
        <span className="text-orange-400 font-normal italic">(React.memo)</span>
      </p>
      <div className="h-36 overflow-y-auto text-sm text-orange-900 space-y-1">
        {ROWS.slice(0, 50).map(n => (
          <div key={n} className="flex justify-between bg-white/60 px-2 py-0.5 rounded">
            <span className="text-gray-500">Row {n}</span>
            <span className="font-mono">{(n * multiplier).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="text-center text-orange-400 italic py-2">… 9,99,950 more rows</div>
      </div>
    </div>
  );
});

// ─── Content ─────────────────────────────────────────────────────────────────
function Content() {
  const { renderCount, forceRerender } = useRenderTracker('Content');

  const [multiplier, setMultiplier] = useState(1);
  const [count, setCount] = useState(0);

  // useCallback: stable function reference — doesn't cause RowList to re-render
  // even when Content re-renders due to `count` changing
  const handleMultiplierChange = useCallback((m) => {
    setMultiplier(m);
  }, []);

  // useMemo: only recomputes when multiplier changes (not when count changes)
  const total = useMemo(() => {
    console.log('🔄 useMemo running — computing total from 10,00,000 rows...');
    return ROWS.reduce((sum, n) => sum + n * multiplier, 0);
  }, [multiplier]);

  return (
    <div className="relative flex-1 bg-orange-100 border-2 border-orange-400 rounded-xl p-4">
      <DebugOverlay name="Content" renderCount={renderCount} onRerender={forceRerender} />

      <div className="flex items-center justify-between mb-3">
        <code className="text-sm bg-orange-200 text-orange-900 px-2 py-1 rounded font-mono">
          function () {'{ }'} <span className="text-orange-600">(useCallback)</span>
        </code>
        <p className="text-xs text-orange-500 italic">Content.jsx</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-orange-900">Multiplier:</span>
          {[1, 2, 3].map(m => (
            <button
              key={m}
              onClick={() => handleMultiplierChange(m)}
              className={`px-3 py-1 rounded-lg text-sm font-bold border-2 transition ${
                multiplier === m
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-orange-700 border-orange-300 hover:border-orange-500'
              }`}
            >
              ×{m}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-3 py-1 rounded-lg text-sm font-bold bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300 transition"
        >
          Re-render (count: {count})
        </button>
      </div>

      {/* useMemo box */}
      <div className="border-2 border-red-400 rounded-xl p-4 bg-orange-50">
        <p className="text-red-600 font-bold text-sm mb-3">
          Total number <span className="font-normal italic">(useMemo)</span>
        </p>
        <div className="bg-orange-100 border border-red-300 rounded-lg px-4 py-2 mb-3 text-center">
          <span className="text-lg font-bold text-red-700">
            Total = {total.toLocaleString('en-IN')}
          </span>
          <p className="text-xs text-orange-600 mt-1">
            Multiplier: ×{multiplier} — check console to see when useMemo recomputes
          </p>
        </div>

        <RowList multiplier={multiplier} />
      </div>
    </div>
  );
}

export default Content;
