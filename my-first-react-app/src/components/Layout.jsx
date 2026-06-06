import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Content from './Content';
import Footer from './Footer';
import { useRenderTracker } from '../debug/useRenderTracker';
import { DebugOverlay } from '../debug/DebugOverlay';

// ⚠️  Layout is the classic prop-drilling MIDDLEMAN.
//
// It receives selectedMenu + onMenuSelect from App and immediately passes
// them to Sidebar and Content. Layout itself never reads these props.
// This is the core pain point: Layout has to know about data it doesn't care
// about just to carry it one level deeper.
//
// With context, Layout would have zero knowledge of selectedMenu.
function Layout({ selectedMenu, onMenuSelect }) {
  const { renderCount, forceRerender } = useRenderTracker('Layout');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="relative bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-5 max-w-5xl mx-auto">
        <DebugOverlay name="Layout" renderCount={renderCount} onRerender={forceRerender} />

        <div className="flex items-center justify-between mb-3">
          {/* Prop drilling annotation — shows students the "pipe" problem */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-full px-3 py-1">
            <span className="text-xs font-bold text-amber-700">🔗 Prop drilling</span>
            <span className="text-xs text-amber-600 font-mono">
              App → <strong>Layout</strong> → Sidebar, Content
            </span>
            <span className="text-xs text-amber-500 italic">(Layout doesn't use this data)</span>
          </div>
          <p className="text-xs text-yellow-600 italic">Layout.jsx</p>
        </div>

        <Navbar />

        <div className="flex gap-4 mb-4">
          {/* Passes selectedMenu down — Layout is just a pipe */}
          <Sidebar selectedMenu={selectedMenu} onMenuSelect={onMenuSelect} />
          <Content selectedMenu={selectedMenu} />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
