import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

function Navbar() {
  const { renderCount, forceRerender } = useRenderTracker('Navbar');

  return (
    <nav className="relative bg-blue-200 border-2 border-blue-400 rounded-xl p-4 mb-4">
      <DebugOverlay name="Navbar" renderCount={renderCount} onRerender={forceRerender} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">MyApp</h1>
        <div className="flex gap-6 text-blue-800 font-medium">
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
