import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

function Footer() {
  const { renderCount, forceRerender } = useRenderTracker('Footer');

  return (
    <footer className="relative bg-blue-200 border-2 border-blue-400 rounded-xl p-4 mt-4">
      <DebugOverlay name="Footer" renderCount={renderCount} onRerender={forceRerender} />

      <div className="flex items-center justify-between text-blue-800">
        <span className="font-medium">© 2024 MyApp</span>
        <span className="text-sm">Built with React</span>
      </div>
      <p className="text-xs text-blue-600 mt-1 text-right italic">Footer.jsx</p>
    </footer>
  );
}

export default Footer;
