import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'

/**
 * App - Top-level component that manages login state.
 * 
 * This demonstrates:
 * 1. CONDITIONAL RENDERING: Navbar shows LoginForm or UserProfile based on isLoggedIn
 * 2. PROP DRILLING: username & onLogout passed through multiple layers
 *    App → Navbar → (LoginForm | UserProfile)
 *    App → Dashboard (another branch of prop drilling)
 */
function App() {
   // State managed at the top level
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

   // Handle login from LoginForm
  const handleLogin = (user) => {
    setUsername(user)
    setIsLoggedIn(true)
   }

   // Handle logout from UserProfile
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
   }


  return (
      <div className="min-h-screen bg-[#f5f5fa]">
        {/* 
          PROP DRILLING EXAMPLE:
            - isLoggedIn, username, handleLogin, handleLogout all drilled down
            - Navbar decides which sub-component to render (conditional rendering)
         */}
        <Navbar
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />

      <Dashboard isLoggedIn={isLoggedIn} username={username} />
    </div>
   )
}

export default App
