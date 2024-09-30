import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Table from './Table.jsx'
import StoragePopup from './PersistentStoragePopup.jsx'
import Menu from './Menu.jsx'

// ask for persistant storage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className={'menu'}>
      <StoragePopup />
      <Menu />
    </div>
    <Table />
  </StrictMode>,
)
