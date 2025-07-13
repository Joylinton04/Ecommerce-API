import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain='dev-3dmvhxpk5h27gflm.us.auth0.com'
      clientId='ABlUOYuSznh9cBn1q3lKT18NNrZ5xbAa'
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'uniqueIdentifier',
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
)
