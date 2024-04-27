import React from 'react'
import NavBar from './NavBar'
import '../styles/AppWrapper.css';

function AppWrapper({ children }) {
  return (
    <div>
      <NavBar/>
      <div className="app-container">{children}</div>
        <footer>
            <p>Copyright © 2024 LernItApp. All rights reserved.</p>
            <p><a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a> | <a href="/contact">Contact Us</a></p>
        </footer>
    </div>
  )
}

export default AppWrapper