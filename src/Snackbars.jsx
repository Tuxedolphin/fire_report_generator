import { useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle } from "@mui/material";

const Snackbars = ({ error, createStack, setCreateStack }) => {

  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState('');

  useEffect(() => {

    if (!createStack) return;

    if (open) {
      setOpen(false);
    } else {
      
      let message = 'Please ensure that';

      for (const [key, value] of Object.entries(error)) {
        if (key !== 'numbEntry') {
          if (value) {
            message = message + ' the input field at the top is filled up correctly';
            break;
          }
        }
      }
      
      if (error.numbEntry) {
        message = message + ` ${(message !== 'Please ensure that') ? 'and' : ''}` + " there is at least one photo entry";
      }
      
      if (message === 'Please ensure that') return;

      setMessageInfo(message + '.');
      setOpen(true);
      setCreateStack(false);
  } 

  }, [error, open, createStack, setCreateStack]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
    <Snackbar
      key={messageInfo ? messageInfo : undefined}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="error"
        action={
          <>
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </>
        }  
      >
        <AlertTitle>Report could not be generated</AlertTitle>
        {messageInfo}
      </Alert>
    </Snackbar>
    </>
  )
}

Snackbars.propTypes = {
  error: PropTypes.object,
  createStack: PropTypes.bool,
  setCreateStack: PropTypes.func,
}

export default Snackbars