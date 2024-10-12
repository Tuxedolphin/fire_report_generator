import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Table from './Table.jsx'
import StoragePopup from './PersistentStoragePopup.jsx'
import Menu from './Menu.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoragePopup/>
    <div className={'menu'}>
      <Menu />
    </div>
    <Table />
  </StrictMode>,
)
