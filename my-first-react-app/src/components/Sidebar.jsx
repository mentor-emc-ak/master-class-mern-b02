import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';
import { useApp } from '../context/AppContext';

// Sidebar shows BOTH data sources side by side:
//
//   user.role  ←  Context  (no prop needed, just call useApp())
//   selectedMenu  ←  Prop  (drilled from App → Layout → Sidebar)
//
// The contrast is intentional: role doesn't need a prop, but selectedMenu does
// because it's owned by App and routed through Layout.
function Sidebar({ selectedMenu, onMenuSelect }) {
  const { renderCount, forceRerender } = useRenderTracker('Sidebar');
  const { user } = useApp();

  const menuItems = ['Dashboard', 'Reports', 'Users', 'Settings', 'Help'];

  return (
    <aside className="relative bg-green-200 border-2 border-green-400 rounded-xl p-4 w-52 shrink-0 flex flex-col gap-2">
      <DebugOverlay name="Sidebar" renderCount={renderCount} onRerender={forceRerender} />

      {/* Context source */}
      <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1.5">
        <span className="text-xs font-bold text-violet-600 bg-violet-100 border border-violet-300 rounded-full px-2 shrink-0">
          📡 Context
        </span>
        <span className="text-xs text-violet-900">
          Role: <strong>{user.role}</strong>
        </span>
      </div>

      {/* Prop source */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
        <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 rounded-full px-2 shrink-0">
          🔗 Prop
        </span>
        <span className="text-xs text-amber-900">
          Active: <strong>{selectedMenu}</strong>
        </span>
      </div>

      <p className="text-xs text-green-700 italic">Sidebar.jsx</p>

      {menuItems.map(item => (
        <button
          key={item}
          onClick={() => onMenuSelect(item)}
          className={`text-left font-medium rounded-lg px-3 py-2 transition text-sm ${
            selectedMenu === item
              ? 'bg-green-600 text-white shadow-inner'
              : 'bg-green-100 hover:bg-green-300 text-green-900'
          }`}
        >
          {item}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
