import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import RoutesProvider from './routes/RoutesProvider'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoutesProvider />
  </React.StrictMode>,
)
