import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.scss'
import './doctor.scss'
import App from './App'
import { UserProvider } from './context/UserContext'
import ScrollToTop from './components/ScrollToTop'
import { GoogleMapsProvider } from './context/GoogleMapContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <UserProvider>
    <GoogleMapsProvider>
      {/* <BrowserRouter basename="/tabsbook-frontend/"> */}
      <HashRouter>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </HashRouter>
    </GoogleMapsProvider>
  </UserProvider>
)
