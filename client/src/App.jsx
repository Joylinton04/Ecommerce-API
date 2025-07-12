import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from "axios";



const App = () => {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    user
  } = useAuth0()

  async function callProtectedRoute() {
      const token = await getAccessTokenSilently()
      
      try {
        const response = await axios.get('http://localhost:3000/protected',{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response.data)
      }catch(err) {
        console.log(err)
      }
  }


  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>ECOMMERCE CLIENT</h1>

      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '5rem'
        }}
      >
        <li><button onClick={() => loginWithPopup()}>LoginWithPopUp</button></li>
        <li><button onClick={() => loginWithRedirect()}>LoginWithRedirect</button></li>
        <li><button onClick={() => logout()}>Logout</button></li>
      </ul>

      <h1 style={{textAlign: 'center', marginTop: '4rem'}}>Welcome to our page</h1>
      {isAuthenticated
        && <h2 style={{textAlign: 'center'}}>User is logged</h2>}

      {isAuthenticated && 
        <p>{JSON.stringify(user)}</p>
      }


      <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center',marginTop: '2rem'}}>
        <button onClick={() => callProtectedRoute()}>Protected route</button>
      </div>
    </div>
  )
}

export default App