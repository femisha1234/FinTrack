import React from 'react'
import'./Sidebar.css'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div>
<nav className="adminsidebar">
  <h2>FinTrack</h2>
 <Link to='/admin'>Dashboard</Link> 
 <Link to='/user'> User Management</Link>
 <Link to='/analytics'>Analytics</Link>
 <Link to='/settings'>Settings </Link>
 

</nav>

    </div>
  )
}

export default Sidebar