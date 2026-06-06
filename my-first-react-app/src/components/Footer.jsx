import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';
import { useApp } from '../context/AppContext';

// Footer reads from Context only — no props required.
// When user.name changes (via Navbar's edit form), Footer updates automatically.
function Footer() {
  const { renderCount, forceRerender } = useRenderTracker('Footer');
  const { user, notifications } = useApp();

  return (
    <footer className="relative bg-blue-200 border-2 border-blue-400 rounded-xl p-3 mt-4">
      <DebugOverlay name="Footer" renderCount={renderCount} onRerender={forceRerender} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-600 bg-violet-100 border border-violet-300 rounded-full px-2 py-0.5">
            📡 Context
          </span>
          <span className="text-sm text-blue-900">
            Logged in as <strong>{user.name}</strong>
            <span className="text-blue-600 ml-1">({user.role})</span>
          </span>
          <span className="text-sm text-blue-700">
            · 🔔 {notifications} notification{notifications !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-sm text-blue-700 font-medium">Built with React</span>
      </div>
      <p className="text-xs text-blue-500 mt-1 text-right italic">Footer.jsx</p>
    </footer>
  );
}

export default Footer;
