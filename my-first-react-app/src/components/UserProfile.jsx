import PropTypes from 'prop-types';

/**
 * UserProfile - Displays logged-in user info and a logout button.
 * 
 * Receives `username` and `onLogout` via PROP DRILLING from Navbar.
 */
export default function UserProfile({ username, onLogout }) {
  return (
          <div className="flex items-center gap-3 bg-white/15 px-4 py-2 rounded-xl backdrop-blur">
            <div className="w-10 h-10 rounded-full bg-white text-[#764ba2] flex items-center justify-center font-bold text-xl">
              {username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex flex-col">
              <p className="m-0 text-xs text-[#e0d4f5]">Welcome,</p>
              <p className="m-0 font-bold text-base">{username}</p>
            </div>
            <button onClick={onLogout} className="px-3.5 py-2 bg-white/20 text-white border border-white/40 rounded-lg cursor-pointer font-bold text-sm hover:bg-white/30 transition">
           Logout
           </button>
          </div>
        );
}

UserProfile.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
