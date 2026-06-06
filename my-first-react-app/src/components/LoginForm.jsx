import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

/**
 * LoginForm - Renders a simple login form.
 * 
 * This component receives `onLogin` via PROP DRILLING from Navbar,
 * which itself received it from App (the top-level state manager).
 */

// I want to focus the login username on page load, so I will use useRef to create a reference to the input element and then focus it in a useEffect hook.

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
      }
    };

  const handleResize = () => {
    console.log('Window resized! Current dimensions:', { width: window.innerWidth, height: window.innerHeight });
    }


  useEffect(() => {
    if (username) {
      console.log('Username changed:', username);
       }
    console.log('This will run on every render of LoginForm. Current values:', { username, password })

    window.addEventListener('resize', handleResize);

       // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      };
    }, [username, password])

  return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded-xl text-gray-800 min-w-[260px] shadow-md">
          <h3 className="text-base font-bold">User Login</h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              ref={inputRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#667eea]"
              required
            />
          </div>

          <button type="submit" className="py-2.5 bg-[#667eea] text-white border-0 rounded-lg font-bold cursor-pointer mt-1 hover:opacity-90 transition">
           Login
          </button>
        </form>
      );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
