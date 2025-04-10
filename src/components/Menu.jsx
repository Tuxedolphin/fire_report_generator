import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Regex for validating the inputs
const regex = {
  incidentNumb: new RegExp("^20\\d{6}/\\d{4}$"),
  bagNumb: new RegExp("^\\d{4}$"),
  postalCode: new RegExp("^\\d{6}$"),
};

// Error message should the input be invalid
const message = {
  incidentNumb: "Please use the format YYYYMMDD/XXXX",
  bagNumb: "Please ensure that it is a 4 digit number",
  postalCode: "Please ensure that it is a 6 digit number",
};

// Object defining which function maps to which entry
const validateMap = {
  incidentNumb: validateIncidentNumb,
  bagNumb: validateBagNumb,
  postalCode: validatePostalCode,
};

/**
 * Saves the input from the menu into local storage
 * @param {event} event
 */
function saveInput(event) {
  localStorage.setItem(event.target.id, event.target.value);
}

/**
 * Validates the incident number according to YYYYMMDD/XXXX
 * @param {string} value The inputted value from the incident number field in the menu
 * @returns bool of if the incident number is valid
 */
function validateIncidentNumb(value) {
  if (!regex.incidentNumb.test(value)) return false;
  return !isNaN(
    Date.parse(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`)
  );
}

/**
 * Validates the evidence bag number - requires 4 digits
 * @param {string} value The value of the evidence bag number inputted into the menu
 * @returns bool of if the evidence bag number is valid
 */
function validateBagNumb(value) {
  return regex.bagNumb.test(value);
}

/**
 * Validates the postal code - requires 6 digits
 * @param {string} value The value of the postal code inputted into the menu
 * @returns bool of if the postal code is valid
 */
function validatePostalCode(value) {
  return regex.postalCode.test(value);
}

Menu.propTypes = {
  clearAll: PropTypes.bool, // Bool of if the we need to clear all the fields
  setClearAll: PropTypes.func,
  error: PropTypes.object, // Object where the key is the field where there may be an issue, and the value is the error message
  setError: PropTypes.func,
};

function Menu({ clearAll, setClearAll, error, setError }) {
  const [incNumb, setIncNumber] = useState("");
  const [bagNumb, setBagNumber] = useState("");
  const [location, setLocation] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [c1acc, setC1acc] = useState(false);

  useEffect(() => {
    // Need to make sure they are not null
    setIncNumber(
      localStorage.getItem("incidentNumb")
        ? localStorage.getItem("incidentNumb")
        : ""
    );
    setBagNumber(
      localStorage.getItem("bagNumb") ? localStorage.getItem("bagNumb") : ""
    );
    setLocation(
      localStorage.getItem("location") ? localStorage.getItem("location") : ""
    );
    setPostalCode(
      localStorage.getItem("postalCode")
        ? localStorage.getItem("postalCode")
        : ""
    );
    setC1acc(
      JSON.parse(localStorage.getItem("c1acc") === null)
        ? false
        : JSON.parse(localStorage.getItem("c1acc"))
    );
  }, []);

  // If clearAll is called, remove all items and then reset
  useEffect(() => {
    if (clearAll) {
      localStorage.clear();

      setIncNumber("");
      setBagNumber("");
      setLocation("");
      setPostalCode("");
      setC1acc(false);

      setClearAll(false);
    }
  }, [clearAll, setClearAll]);

  function validateInput(event) {
    const type = event.target.id;

    if (event.target.value.length === 0) {
      setError({ ...error, [type]: "" });
      return;
    }
    if (validateMap[type](event.target.value)) {
      saveInput(event);
      setError({ ...error, [type]: "" });
    } else {
      setError({ ...error, [type]: message[type] });
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "80vw",
        flexGrow: 1,
        marginBottom: "25px",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" gutterBottom marginTop={"50px"}>
        {" "}
        Fire Report Generator{" "}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={4}>
          <TextField
            id="incidentNumb"
            label="Incident Number"
            variant="standard"
            fullWidth
            required
            value={incNumb}
            autoComplete="off"
            onChange={(event) => {
              setIncNumber(event.target.value);
            }}
            onBlur={(event) => {
              validateInput(event);
            }}
            error={!!error.incidentNumb}
            helperText={error.incidentNumb}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            id="bagNumb"
            label="Evidence Bag Number"
            variant="standard"
            fullWidth
            value={bagNumb}
            autoComplete="off"
            onChange={(event) => {
              setBagNumber(event.target.value);
            }}
            onBlur={(event) => {
              validateInput(event);
            }}
            error={!!error.bagNumb}
            helperText={error.bagNumb}
          />
        </Grid>
        <Grid size={4} sx={{ alignItems: "center" }}>
          <ToggleButtonGroup
            exclusive
            value={c1acc ? "c1acc" : "full"}
            onChange={(_, newValue) => {
              if (newValue !== null) {
                const newState = newValue === "c1acc";
                setC1acc(newState);
                localStorage.setItem("c1acc", JSON.stringify(newState));
              }
            }}
            aria-label="Report Type"
            size="small"
            color="primary"
            sx={{
              width: "100%",
              mt: 1,
              "& .MuiToggleButton-root": {
                border: "0px solid transparent",
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                borderRadius: 0,
                textTransform: "none",
                color: "rgba(0, 0, 0, 0.6)",
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                  color: "primary.main",
                  borderBottom: "2px solid",
                  borderColor: "primary.main",
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              },
            }}
          >
            <ToggleButton
              value="full"
              aria-label="Full Report"
              sx={{ width: "50%" }}
            >
              Full Report
            </ToggleButton>
            <ToggleButton
              value="c1acc"
              aria-label="C1 Accidental Report"
              sx={{ width: "50%" }}
            >
              C1 Accidental
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid size={8}>
          <TextField
            id="location"
            label="Location"
            variant="standard"
            fullWidth
            required
            autoComplete="off"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                setError({ ...error, location: "" });
              }
              saveInput(event);
            }}
            error={!!error.location}
            helperText={error.location}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            id="postalCode"
            label="Postal Code"
            variant="standard"
            fullWidth
            value={postalCode}
            autoComplete="off"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Singapore</InputAdornment>
                ),
              },
            }}
            onChange={(event) => {
              setPostalCode(event.target.value);
            }}
            onBlur={(event) => {
              validateInput(event);
            }}
            error={!!error.postalCode}
            helperText={error.postalCode}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Menu;
