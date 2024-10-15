import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Box, TextField, InputAdornment, Switch, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const regex = new RegExp('20\\d{6}/\\d{4}');

function saveInput(event) {
  localStorage.setItem(event.target.id, event.target.value);
}

function validateIncidentNumb(value) {
  if (!regex.test(value)) return false;
  return !isNaN(Date.parse(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`));

}

Menu.propTypes = {
  clearAll: PropTypes.bool,
  setClearAll: PropTypes.func,
};

function Menu({ clearAll, setClearAll }) {

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

  const [incNumbError, setIncNumbError] = useState('');

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
            onChange={(event) => {setIncNumber(event.target.value)}}
            onBlur={(event) => {
              if (event.target.value.length === 0) {
                setIncNumbError('');
                return;
              }
              if (validateIncidentNumb(event.target.value)) {
                saveInput(event);
                setIncNumbError('');
              } else {
                setIncNumbError('Please use the format YYYYMMDD/XXXX')
              }
            }}
            error={!!incNumbError}
            helperText={incNumbError}
          />
        </Grid>
        <Grid size={4}>
          <TextField
          id='bagNumb'
          label='Evidence Bag Number'
          variant='standard'
          fullWidth
          value={bagNumb}
          onChange={(event) => {setBagNumber(event.target.value)}}
          onBlur={(event) => {saveInput(event)}}
          />
        </Grid>
        <Grid size = {4}>
          <Typography>Report Type:</Typography>
          <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
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
          value={location}
          onChange={(event) => {setLocation(event.target.value)}}
          onBlur={(event) => {saveInput(event)}}
          />
        </Grid>
        <Grid size={4}>
          <TextField 
            id='postalCode'
            label='Postal Code' 
            variant='standard'
            fullWidth
            value={postalCode}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Singapore</InputAdornment>,
              },
            }}
            onChange={(event) => {setPostalCode(event.target.value)}}
            onBlur={(event) => {saveInput(event)}}
            />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Menu;