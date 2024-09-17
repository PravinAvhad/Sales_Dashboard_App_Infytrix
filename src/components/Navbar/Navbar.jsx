import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css"

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navsection">
                <div className="logosection">
                    <Link to="/" className='logo'>Sales Dashboard App</Link>
                </div>
                <div className="linksection">
                    <Link to="/" className='links'>Today's Sales</Link>
                    <Link to="/comparison" className='links'>Sales Comparison</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;