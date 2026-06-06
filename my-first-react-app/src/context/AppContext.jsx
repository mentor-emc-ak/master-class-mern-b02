import { createContext, useContext, useState } from 'react';

// ─── Context definition ───────────────────────────────────────────────────────
// Any component in the tree can read or update this data without receiving
// props. No middleman components. No drilling.
const AppContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
// Wrap the app once with <AppProvider> and every descendant can call useApp().
export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Akhshy', role: 'Teacher' });
  const [notifications, setNotifications] = useState(3);

  const updateName = (name) => setUser(u => ({ ...u, name: name.trim() }));

  return (
    <AppContext.Provider value={{ user, setUser, updateName, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Call useApp() inside any component to read or update the shared state.
// No props needed. No middleman.
export const useApp = () => useContext(AppContext);
