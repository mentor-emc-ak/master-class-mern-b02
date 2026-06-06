import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

function Sidebar() {
  const { renderCount, forceRerender } = useRenderTracker('Sidebar');
  const menuItems = ['Dashboard', 'Reports', 'Users', 'Settings', 'Help'];

  return (
    <aside className="relative bg-green-200 border-2 border-green-400 rounded-xl p-4 w-48 shrink-0 flex flex-col gap-2">
      <DebugOverlay name="Sidebar" renderCount={renderCount} onRerender={forceRerender} />

      <p className="text-xs text-green-700 italic mb-2">Sidebar.jsx</p>
      {menuItems.map(item => (
        <button
          key={item}
          className="text-left bg-green-100 hover:bg-green-300 text-green-900 font-medium rounded-lg px-3 py-2 transition"
        >
          {item}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
