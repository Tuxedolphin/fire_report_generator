import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExampleWithProviders from './Table.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExampleWithProviders />
  </StrictMode>,
)
