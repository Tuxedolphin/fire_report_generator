import { useMemo, useState, useEffect } from 'react';
import {
  addPhoto,
  updatePhoto,
  deletePhoto,
  clearAll,
  retrievePhoto,
  retrieveAll,
} from './db.jsx'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ActionMenuItem,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  styled,
} from '@mui/material';
import { Delete, Add, CloudUpload } from '@mui/icons-material';

// Hidden Input For Adding Functionality To Some Buttons
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Object to hold the required information of each photo
function Photo(image, numb, photoNumb, description, id = -1, copyOf = null, hasCopy = "false") { // Note that image is of type Image
  this.id = id;
  this.image = new Image();
  this.image.url = URL.createObjectURL(image);
  this.image.onload = function() {
    this.orientation = ((this.image.width > this.image.height) ? "landscape" : "portrait"); // TODO: Check if working
    console.log(this.image.width + this.image.height);
  }
  this.numb = numb.toString();
  this.photoNumb = photoNumb.toString();
  this.description = description;
  this.copyOf = copyOf;
  this.hasCopy = hasCopy;
  this.blob = new Blob([image]);
}


const Table = () => {

  const [data, setData] = useState([]);
  useEffect(() => {
    retrieveAll().then((items) => setData(items.map((entry) => {
      return new Photo(entry.image, entry.numb, entry.photoNumb, entry.description, entry.id, entry.copyOf, entry.hasCopy);
    })));
  }, []);
  
  const [editedRows, setEditedRows] = useState({}); // Holds the rows which were changed
  const [openAddForm, setOpenAddForm] = useState(false); // Holds if add photo form should be opened


  const columns = useMemo(
    () => [
      {
        accessorKey: 'numb',
        header: '#',
        enableEditing: false,
      },
      {
        accessorKey: 'photoNumb',
        header: 'Photo Number',
        muiEditTextFieldProps: ({ row }) => ({
          type: 'text',
          required: true,
          onBlur: () => {
            setEditedRows({ ...editedRows, [row.original.id]: row.original});
            console.log(row);
          }
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 400,
        muiEditTextFieldProps: ({ row }) => ({
          type: 'text',
          required: true,
          onBlur: () => {
            setEditedRows({ ...editedRows, [row.original.id]: row.original});
          }
        }),
      },
    ],
    [editedRows],
  );

  const handleSave = async () => {
    await updatePictures((editedRows)); 
    setEditedRows({});
  }

  const createCopy = (image) => {
    
    console.log(image);
    let newCopy = { ...image, copyOf: image.id, numb: `Copy of ${image.numb}`, description: ''};
    newCopy.copyOf = image.id;
    // newCopy.id = addPhoto(newCopy);

    const originalIndex = data.indexOf(image);

    let newData = (data);
    newData[originalIndex].hasCopy = "true";

    newData.splice(originalIndex + 1, 0, newCopy);
    console.log(newData)

    setData(newData);
  }

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deletePhoto(row.original.id);

      let newData = data.filter((photo) => {photo !== row.original});
      
      // for (let i = data.indexOf(row.original); i < newData.length; i++) {

      // }

      setData();
    }

  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: 'cell',
    enableRowActions: true,
    enableRowOrdering: true,
    enableSorting: false,
    enableColumnResizing: true,
    enableExpandAll: false,
    initialState: {
      columnPinning: { right: ['mrt-row-actions'] },
    },
    muiRowDragHandleProps: ({ table }) => ({

      // TODO: Check if it is a copy and if so, move the other one as well
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          let newData = (data);
          newData.splice(
            hoveredRow.index, 0, newData.splice(draggingRow.index, 1)[0]
          );

          let a = data[hoveredRow.index].numb;
          let b = data[draggingRow.index].numb;

          // Updating the picture order numbers
          let wasCopy = false;
          for (let i = Math.min(a, b) - 1; i < Math.max(a, b); i++) {
            console.log(newData[i].numb[0])
            if (newData[i].numb[0].toLowerCase() === 'c' && !wasCopy) {
              newData[i].numb = `Copy of Photo ${i}` // TODO: Fix bug for not changing row number
              i--;
              wasCopy = true;
            } else {
              newData[i].numb = i + 1;
              wasCopy = false;
            }
          }
          setData([...newData]);
        }
      },
    }),
    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem
        icon={<Add />}
        key="add"
        label="Create Copy"
        onClick={() => {
          createCopy(row.original)}}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Delete"
        onClick={() => openDeleteConfirmModal(row)}
        table={table}
      />,
    ],
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSave}
          disabled={Object.keys(editedRows).length === 0}
        >
          {'Save'}
        </Button>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        variant="contained"
        onClick={() => {
          setOpenAddForm(true);
        }}
      >
        Upload Photo
      </Button>
    ),
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row }) => ({
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original ? (
        <Box
          sx={{
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <img src={URL.createObjectURL(row.original.blob)}></img>
        </Box>
      ) : null,
  });

  // Modals for data entry
  function AddPhotoForm() {

    const [photo, setPhoto] = useState(new File([""], "empty"));
    const [status, setStatus] = useState('');
    const [validFile, setValidFile] = useState('');
    const [disableButton, setDisableButton] = useState(true);

    const checkFileValidity = (file) => {

      if (!file) {
        setValidFile('error');
        setStatus('File could not be uploaded.')
        setDisableButton(true);
      }

      let parts = file['name'].split('.');
      let result = ['jpeg', 'jpg', 'png', 'raw', 'heic'].indexOf(parts[parts.length - 1]);

      if (result < 0) {
        setValidFile('error');
        setStatus(`File "${file['name']}" has invalid file format.`);
        setDisableButton(true);
        return false;
      } else {
        setValidFile('success');
        setStatus(`File "${file['name']}" uploaded`);
        setDisableButton(false);
        return true;
      }

    }

    const handleFile = (file) => {
      if (!checkFileValidity(file)) {
        return;
      }

      setPhoto(file);
    }

    const handleClose = () => {
      setPhoto(new File([''], 'empty'));
      setDisableButton(true);
      setStatus('');
      setValidFile('');
      setOpenAddForm(false);
    }

    return (
      <Dialog
        open={openAddForm}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const newData = Object.fromEntries(formData.entries());
            
            console.log(data);

            const currentNumb = (data.length === 0) ? 0 : data.at(-1).numb.slice(-1);

            let newPhoto = new Photo(photo, +currentNumb + 1, newData.photoNumb, newData.description);
            console.log(newPhoto);
            addPhoto(newPhoto);
            setData([...data, newPhoto]);

            handleClose();
          },
        }}
        fullWidth
      >
        <DialogTitle>Add Photo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id='photoNumb'
            name='photoNumb'
            required
            margin='dense'
            label='Photo Number'
            variant='standard'
            type='text'
            autoComplete='off'
            fullWidth
          />
          <TextField 
            id='description'
            name='description'
            required
            margin='dense'
            label='Description'
            variant='standard'
            type='text'
            autoComplete='off'
            fullWidth
            multiline
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{ marginTop: '8px', marginBottom: '4px' }}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                try {
                console.log(event.target.files[0])
                handleFile(event.target.files[0])
                } catch (error) {
                  console.log(error);
                  handleFile(null);
                }
              }}
            />
          </Button>
          <Typography color={validFile}> {status} </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={disableButton}>Submit</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function AddCopyForm() {

  }

  return (
    <>
      <MaterialReactTable table={table} />
      <AddPhotoForm />
      <AddCopyForm />
    </>
  )
};

// Saves the rows into the database
function updatePictures(row) {
  
}

export default Table;
