import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import Footer from './Footer';
import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

function Layout() {
  const { renderCount, forceRerender } = useRenderTracker('Layout');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="relative bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-5 max-w-5xl mx-auto">
        <DebugOverlay name="Layout" renderCount={renderCount} onRerender={forceRerender} />

        <p className="text-xs text-yellow-600 text-right italic mb-2">Layout.jsx</p>
        <Navbar />
        <div className="flex gap-4 mb-4">
          <Sidebar />
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
