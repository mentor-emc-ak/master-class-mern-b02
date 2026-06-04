import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Dashboard - A simple dashboard component that receives props.
 * 
 * This is an additional level of prop drilling: App → Navbar → Dashboard
 * demonstrating how props can be passed through multiple component layers.
 */
export default function Dashboard({ isLoggedIn, username }) {

 

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Dashboard</h2>

      {isLoggedIn ? (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👋 Hello, {username}!</h3>
          <p style={styles.cardText}>
            You are currently <strong>logged in</strong>. This dashboard demonstrates
            prop drilling — notice how <code>isLoggedIn</code> and <code>username</code>{' '}
            were passed from the top-level App component all the way down to this Dashboard.
          </p>
          <ul style={styles.list}>
            <li>✅ Conditional rendering at the Navbar level</li>
            <li>✅ Props passed through multiple layers (App → Navbar → UserProfile/Dashboard)</li>
            <li>✅ Sub-components rendered based on login state</li>
          </ul>
        </div>
      ) : (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔒 Not Logged In</h3>
          <p style={styles.cardText}>
            Please log in using the form in the navbar to see your personalized dashboard.
          </p>
        </div>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};

const styles = {
  dashboard: {
    maxWidth: '900px',
    margin: '32px auto',
    padding: '0 24px',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  cardTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.3rem',
  },
  cardText: {
    color: '#555',
    lineHeight: '1.6',
  },
  list: {
    marginTop: '12px',
    paddingLeft: '20px',
    color: '#555',
    lineHeight: '1.8',
  },
};
