import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {

  const [username, setUserName] = useState(null);

useEffect(() => {
  fetch('http://localhost:3001/profile', {
    credentials: 'include',
  }).then(response => {
    response.json().then(userInfo => {
      setUserName(userInfo.username)
    })
  })
}, []);


  return (
    <div>
        <header>
        <Link to="/" className='logo'> MyBlog </Link>
        <nav>
          {username && (
            <>
              <Link to='/create'> Create new Post </Link>
            </>
          )}
          {!username && (
            <>
          <Link to='/login'> Login </Link>
          <Link to='register'> Register </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  )
}

export default Header