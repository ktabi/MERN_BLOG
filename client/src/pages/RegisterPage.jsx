import React, { useState } from 'react';
// import axios from 'axios';


function RegisterPage() {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")

  async function register(e){
    e.preventDefault();
      const response = await fetch("http://localhost:3001/register",{ 
        method: 'POST', 
        body: JSON.stringify({username, password}),
        headers: {'Content-Type':'application/json'},
        });
        // console.log(response)
        if(response.status == 200){
          alert("Welcome " + username)
        } else {
          alert('Something Went Wrong. Try again')
        }
  }

  return (
    <form className='register'>
        <h1>Register</h1>
        <input type="text" 
        placeholder="username" 
        value={username}
        onChange={event => setUserName(event.target.value)}/>

        <input type="password" 
        placeholder="password" 
        value={password} 
        onChange={event => setPassword(event.target.value)} />
        <button onClick={register}> Register </button>
    </form>
  )
}

export default RegisterPage