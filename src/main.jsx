import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Table from './Table.jsx'
import StoragePopup from './PersistentStoragePopup.jsx'

// ask for persistant storage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoragePopup />
    <Table />
  </StrictMode>,
)
