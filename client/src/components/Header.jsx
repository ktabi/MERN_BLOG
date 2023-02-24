import React, {useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {UserContext} from '../UserContext';

function Header() {
const {setUserInfo, userInfo} = useContext(UserContext);
useEffect(() => {
  fetch('http://localhost:3001/profile', {
    credentials: 'include',
  }).then(response => {
    response.json().then(userInfo => {
      setUserInfo(userInfo);
    })
  })
}, []);

//Logout Function
function logout() {
  fetch('http://localhost:3001/logout', {
    credentials: 'include',
    method: 'POST'
  });
  setUserInfo(null);
}

// grabbing username from userInfo if available in context
const username = userInfo?.username;

// what the website is about
//Chanell -Learn the way. bridge the gap. older engineers can write about mistakes they see often. new 
//programmers can talk about how they mastered a specific thing task.

  return (
    <div>
        <header>
        <Link to="/" className='logo'> Channel </Link>
        <nav>
          {username && (
            <>
              <Link to='/create'> Create new Post </Link>
              <Link onClick={logout}> Logout </Link>
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