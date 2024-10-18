import { useState, useEffect } from "react";
import './App.css';
import Table from './Table.jsx';
import StoragePopup from './PersistentStoragePopup.jsx';
import Menu from './Menu.jsx';
import Snackbars from "./Snackbars.jsx";

function App() {
  
  const [clearAll, setClearAll] = useState(false);
  const [error, setError] = useState({
    incidentNumb: '',
    bagNumb: '',
    location: '',
    postalCode: '',
    numbEntry: '',
  });
  const [createStack, setCreateStack] = useState(false);

  return (
    <>
      <StoragePopup  />
      <div className={'menu'}>
        <Menu
          clearAll={clearAll}
          setClearAll={setClearAll}
          error={error}
          setError={setError} 
        />
      </div>
      <Table
        error={error}
        setError={setError}
        setClearAll={setClearAll}
        setCreateStack={setCreateStack}
      />
      <Snackbars error={error} createStack={createStack} setCreateStack={setCreateStack} />
    </>
  )
}

export default App