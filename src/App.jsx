import React, { useState } from "react";
import './App.css'
import Table from './Table.jsx'
import StoragePopup from './PersistentStoragePopup.jsx'
import Menu from './Menu.jsx'

function App() {

  const [clearAll, setClearAll] = useState(false);

  return (
    <>
      <StoragePopup/>
      <div className={'menu'}>
        <Menu />
      </div>
      <Table />
    </>
  )
}

export default App