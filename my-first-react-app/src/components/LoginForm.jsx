import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * LoginForm - Renders a simple login form.
 * 
 * This component receives `onLogin` via PROP DRILLING from Navbar,
 * which itself received it from App (the top-level state manager).
 */
export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.formTitle}>User Login</h3>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="login-username">
          Username
        </label>
        <input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={styles.input}
          required
        />
      </div>

      <button type="submit" style={styles.button}>
        Login
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#fff',
    padding: '16px 20px',
    borderRadius: '10px',
    color: '#333',
    minWidth: '260px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  button: {
    padding: '10px',
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '4px',
  },
};
