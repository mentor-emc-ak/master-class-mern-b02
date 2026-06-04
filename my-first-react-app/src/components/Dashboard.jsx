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
       <div className="max-w-[900px] mx-auto my-8 px-6">
         <h2 className="text-3xl text-gray-800 mb-4">Dashboard</h2>

         {isLoggedIn ? (
           <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eee]">
             <h3 className="text-xl mb-2 mt-0">👋 Hello, {username}!</h3>
             <p className="text-gray-600 leading-relaxed">
              You are currently <strong>logged in</strong>. This dashboard demonstrates
              prop drilling — notice how <code>isLoggedIn</code> and <code>username</code>{' '}
              were passed from the top-level App component all the way down to this Dashboard.
             </p>
             <ul className="mt-3 pl-5 text-gray-600 leading-8 list-disc">
               <li>✅ Conditional rendering at the Navbar level</li>
               <li>✅ Props passed through multiple layers (App → Navbar → UserProfile/Dashboard)</li>
               <li>✅ Sub-components rendered based on login state</li>
             </ul>
           </div>
         ) : (
           <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eee]">
             <h3 className="text-xl mb-2 mt-0">🔒 Not Logged In</h3>
             <p className="text-gray-600 leading-relaxed">
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
