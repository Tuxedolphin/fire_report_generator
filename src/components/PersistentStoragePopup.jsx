import { useState, useEffect } from "react";

import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StoragePopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Request for persistent storage
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        if (persistent) {
          console.log("Persistent Storage Granted");
        } else {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 20000);
        }
      });
    }
  }, []);

  return (
    <Collapse in={showPopup}>
      <Alert
        severity="warning"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setShowPopup(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        Persistent storage was not granted to the website. Hence, there is a
        chance that the data saved will be wiped by the browser should the
        website not be accessed after a prolonged period of time.
      </Alert>
    </Collapse>
  );
};

export default StoragePopup;
