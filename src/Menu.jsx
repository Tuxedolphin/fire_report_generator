import { useState, useEffect } from "react";
import { Typography, Box, TextField, InputAdornment, Switch, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function saveInput(event) {
  localStorage.setItem(event.target.id, event.target.value);
}

function Menu() {

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


  return (
    <Box sx={{ width: '100%', maxWidth: '80vw', flexGrow: 1, marginBottom: '25px',  textAlign: 'center'}}>
      <Typography variant='h2' gutterBottom> Fire Report Generator </Typography>
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
            onBlur={(event) => {saveInput(event)}}
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
            <Typography>C1 Accidental Report</Typography>
            <Switch
              checked={c1acc}
              onChange={() => {
                setC1acc(!c1acc);
                localStorage.setItem('c1acc', JSON.stringify(!c1acc));
              }}
            />
            <Typography>Full Report</Typography>
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
            required
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