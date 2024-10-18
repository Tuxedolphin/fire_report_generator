import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, TextField, InputAdornment, Switch, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Regex for validating the inputs
const regex = {
  incidentNumb: new RegExp('^20\\d{6}/\\d{4}$'),
  bagNumb: new RegExp('^\\d{4}$'),
  postalCode: new RegExp('^\\d{6}$'),
}

// Error message should the input be invalid
const message = {
  incidentNumb: 'Please use the format YYYYMMDD/XXXX',
  bagNumb: 'Please ensure that it is a 4 digit number',
  postalCode: 'Please ensure that it is a 6 digit number',
}

// Object defining which function maps to which entry
const validateMap = {
  incidentNumb: validateIncidentNumb,
  bagNumb: validateBagNumb,
  postalCode: validatePostalCode,
}


function saveInput(event) {
  localStorage.setItem(event.target.id, event.target.value);
}

function validateIncidentNumb(value) {
  if (!regex.incidentNumb.test(value)) return false;
  return !isNaN(Date.parse(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`));
}

function validateBagNumb(value) {
  return regex.bagNumb.test(value);
}

function validatePostalCode(value) {
  return regex.postalCode.test(value);
}


Menu.propTypes = {
  clearAll: PropTypes.bool,
  setClearAll: PropTypes.func,
  error: PropTypes.object,
  setError: PropTypes.func,
};

function Menu({ clearAll, setClearAll, error, setError }) {

  const [incNumb, setIncNumber] = useState('');
  const [bagNumb, setBagNumber] = useState('');
  const [location, setLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [c1acc, setC1acc] = useState(false);

  useEffect(() => {
    
    // Need to make sure they are not null
    setIncNumber(localStorage.getItem('incidentNumb') ? localStorage.getItem('incidentNumb') : '');
    setBagNumber(localStorage.getItem('bagNumb') ? localStorage.getItem('bagNumb') : '');
    setLocation(localStorage.getItem('location') ? localStorage.getItem('location') : '');
    setPostalCode(localStorage.getItem('postalCode') ? localStorage.getItem('postalCode') : '');
    setC1acc((JSON.parse(localStorage.getItem('c1acc') === null)) ? false : JSON.parse(localStorage.getItem('c1acc')));
  
  }, [])

  // If clearAll is called, remove all items and then reset
  useEffect(() => {
    if (clearAll) {

      localStorage.clear();

      setIncNumber('');
      setBagNumber('');
      setLocation('');
      setPostalCode('');
      setC1acc(false);
      
      setClearAll(false);
    }
  }, [clearAll, setClearAll]);
  
  function validateInput(event) {
    const type = event.target.id;

    if (event.target.value.length === 0) {
      setError({ ...error, [type]: '' });
      return;
    }
    if (validateMap[type](event.target.value)) {
      saveInput(event);
      setError({ ...error, [type]: '' });
    } else {
      setError({ ...error, [type]: message[type] });
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '80vw', flexGrow: 1, marginBottom: '25px',  textAlign: 'center'}}>
      <Typography variant='h2' gutterBottom marginTop={'50px'}> Fire Report Generator </Typography>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            id='incidentNumb'
            label='Incident Number'
            variant='standard'
            fullWidth
            required
            value={incNumb}
            autoComplete='off'
            onChange={(event) => {setIncNumber(event.target.value)}}
            onBlur={(event) => {
              validateInput(event);
            }}
            error={!!error.incidentNumb}
            helperText={error.incidentNumb}
          />
        </Grid>
        <Grid size={4}>
          <TextField
          id='bagNumb'
          label='Evidence Bag Number'
          variant='standard'
          fullWidth
          value={bagNumb}
          autoComplete='off'
          onChange={(event) => {setBagNumber(event.target.value)}}
          onBlur={(event) => {
            validateInput(event);
          }}
          error={!!error.bagNumb}
          helperText={error.bagNumb}
          />
        </Grid>
        <Grid size = {4} sx={{alignItems: 'center'}}>
          <Typography sx={{alignItems: 'center'}}>Report Type:</Typography>
          <Stack direction='row' spacing={1} sx={{ justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Typography>Full Report</Typography>
            <Switch
              checked={c1acc}
              onChange={() => {
                setC1acc(!c1acc);
                localStorage.setItem('c1acc', JSON.stringify(!c1acc));
              }}
              />
            <Typography>C1 Accidental Report</Typography>
          </Stack>
        </Grid>
        <Grid size={8}>
          <TextField 
          id='location' 
          label='Location' 
          variant='standard' 
          fullWidth 
          required
          autoComplete='off'
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
          }}
          onBlur={(event) => {
            if (!event.target.value) {
              setError({ ...error, location: ''});
            }
            saveInput(event);
          }}
          error={!!error.location}
          helperText={error.location}
          />
        </Grid>
        <Grid size={4}>
          <TextField 
            id='postalCode'
            label='Postal Code' 
            variant='standard'
            fullWidth
            value={postalCode}
            autoComplete='off'
            slotProps={{
              input: {
                startAdornment: <InputAdornment position='start'>Singapore</InputAdornment>,
              },
            }}
            onChange={(event) => {
              setPostalCode(event.target.value);
            }}
            onBlur={(event) => {validateInput(event);}}
            error={!!error.postalCode}
            helperText={error.postalCode}
            />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Menu;