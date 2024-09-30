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
    setIncNumber(localStorage.getItem('incidentNumb'));
    setBagNumber(localStorage.getItem('bagNumb'));
    setLocation(localStorage.getItem('location'));
    setPostalCode(localStorage.getItem('postalCode'));
    setC1acc(JSON.parse(localStorage.getItem('c1acc')));
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
            defaultValue={incNumb}
            onBlur={(event) => {saveInput(event)}}
          />
        </Grid>
        <Grid size={4}>
          <TextField
          id='bagNumb'
          label='Evidence Bag Number'
          variant='standard'
          fullWidth
          defaultValue={bagNumb}
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
                localStorage.setItem('c1acc', JSON.stringify(c1acc));
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
          defaultValue={location}
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
            defaultValue={postalCode}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Singapore</InputAdornment>,
              },
            }}
            onBlur={(event) => {saveInput(event)}}
            />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Menu;