import { DebugProvider } from './debug/DebugContext';
import { RenderDebugger } from './debug/RenderDebugger';
import { useRenderTracker } from './debug/useRenderTracker';
import { DebugOverlay } from './debug/DebugOverlay';
import Layout from './components/Layout';

// AppContent is a separate component so it can call useRenderTracker
// (hooks must be called inside a child of DebugProvider, not in the provider itself)
function AppContent() {
  const { renderCount, forceRerender } = useRenderTracker('App');

  return (
    <div style={{ position: 'relative' }}>
      <DebugOverlay name="App" renderCount={renderCount} onRerender={forceRerender} />
      <Layout />
    </div>
  );
}

function App() {
  return (
    <DebugProvider>
      <AppContent />
      <RenderDebugger />
    </DebugProvider>
  );
}

export default App;
