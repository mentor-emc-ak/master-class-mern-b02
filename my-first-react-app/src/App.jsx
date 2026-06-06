import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { DebugProvider } from './debug/DebugContext';
import { RenderDebugger } from './debug/RenderDebugger';
import { useRenderTracker } from './debug/useRenderTracker';
import { DebugOverlay } from './debug/DebugOverlay';
import Layout from './components/Layout';

// AppContent is a separate component so hooks run inside both providers
function AppContent() {
  const { renderCount, forceRerender } = useRenderTracker('App');

  // ─── PROP DRILLING EXAMPLE ────────────────────────────────────────────────
  // selectedMenu needs to reach Sidebar (to highlight the active item) AND
  // Content (to display which page is open). Watch it travel:
  //
  //   App  ──selectedMenu──►  Layout  ──selectedMenu──►  Sidebar
  //                                   ──selectedMenu──►  Content
  //
  // Layout never reads selectedMenu — it just carries it. That's prop drilling.
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');

  return (
    <div style={{ position: 'relative' }}>
      <DebugOverlay name="App" renderCount={renderCount} onRerender={forceRerender} />
      <Layout selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <DebugProvider>
        <AppContent />
        <RenderDebugger />
      </DebugProvider>
    </AppProvider>
  );
}

export default App;
