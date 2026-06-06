import { useState } from 'react';
import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';
import { useApp } from '../context/AppContext';

// Navbar reads ONLY from Context — no props needed.
// When user.name or notifications change anywhere in the app,
// Navbar re-renders automatically.
function Navbar() {
  const { renderCount, forceRerender } = useRenderTracker('Navbar');
  const { user, updateName, notifications, setNotifications } = useApp();

  const [draft, setDraft]       = useState('');
  const [editing, setEditing]   = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (draft.trim()) { updateName(draft); }
    setDraft('');
    setEditing(false);
  };

  return (
    <nav className="relative bg-blue-200 border-2 border-blue-400 rounded-xl p-3 mb-4">
      <DebugOverlay name="Navbar" renderCount={renderCount} onRerender={forceRerender} />

      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-lg font-bold text-blue-900 shrink-0">MyApp</h1>

        {/* ── Context data ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 flex-1 min-w-0">
          <span className="text-xs font-bold text-violet-600 bg-violet-100 border border-violet-300 rounded-full px-2 py-0.5 shrink-0">
            📡 Context
          </span>

          {/* Editable user name — updates context, ALL components re-render */}
          {editing ? (
            <form onSubmit={handleSave} className="flex gap-1.5 items-center">
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={user.name}
                className="px-2 py-0.5 text-sm border border-violet-400 rounded-lg bg-white w-28 text-blue-900"
              />
              <button type="submit" className="px-2 py-0.5 text-xs bg-violet-500 text-white rounded-lg font-semibold">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-lg">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm font-semibold text-blue-900 hover:text-violet-700 transition-colors"
              title="Click to edit name — watch all components update!"
            >
              👤 {user.name}
              <span className="text-xs font-normal text-violet-400">(edit)</span>
            </button>
          )}

          {/* Notification count — increment here and watch Navbar + Content both update */}
          <div className="flex items-center gap-1 ml-auto text-sm text-blue-800 shrink-0">
            <span>🔔</span>
            <span className="font-bold">{notifications}</span>
            <button
              onClick={() => setNotifications(n => n + 1)}
              className="px-2 py-0.5 text-xs bg-blue-300 hover:bg-blue-400 text-blue-900 rounded-full font-bold transition-colors"
              title="Increment via context — Content will also update"
            >
              +1
            </button>
          </div>
        </div>

        <div className="flex gap-4 text-blue-800 font-medium text-sm shrink-0">
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      <p className="text-xs text-blue-500 mt-1 text-right italic">Navbar.jsx</p>
    </nav>
  );
}

export default Navbar;
