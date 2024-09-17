import React from 'react'
import { Link } from 'react-router-dom'
import "./nopage.css";

const NoPage = () => {
    return (
        <div className="noPage">
            <div className="section">
                <h1>404</h1>
                <h1>Page Not Found</h1>
                <Link to="/" className='linktag'>Go To Home Page</Link>
            </div>
        </div>
    )
}

export default NoPage