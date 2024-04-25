import React from 'react'

function NavBar() {
  return (
    <div>
        <ul className="navbar">
            <li className="title" id="nav-item"><a href="/">LernIt</a></li>
            <li className="nav-item" id="nav-item"><a href="/mysets">My Sets</a></li>
            <li className="nav-item" id="nav-item"><a href="/new">New</a></li>
            <li className="nav-item" id="nav-item"><a href="/about">About</a></li>
            <li className="nav-item" id="nav-item"><a href="/me">Me</a></li>
        </ul>
    </div>
  )
}

export default NavBar