import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

/**
 * Navbar - Top-level component that conditionally renders
 * either the LoginForm or UserProfile based on login status.
 * 
 * Demonstrates PROP DRILLING: username and onLogout are passed
 * through Navbar -> LoginForm/UserProfile without intermediate components reading them.
 */
export default function Navbar({ isLoggedIn, username, onLogout, onLogin }) {
  return (
      <nav className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-4 px-6 shadow-lg">
        <div className="max-w-[900px] mx-auto flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-bold">MyReactApp</h1>

          {isLoggedIn ? (
            // User is logged in → show profile info + logout button
            <UserProfile username={username} onLogout={onLogout} />
          ) : (
            // User is NOT logged in → show login form
            <LoginForm onLogin={onLogin} />
          )}
        </div>
      </nav>
    );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};
