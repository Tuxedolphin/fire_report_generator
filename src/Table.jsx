import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  addPhoto,
  updatePhoto,
  deletePhoto,
  clearAll,
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
import PropTypes, { bool } from "prop-types";
import generateReport from './generateReport.jsx';

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

// class to hold the required information of each photo
class Photo {

  constructor(image, numb, photoNumb, description, id = -1, copyOf = null, hasCopy = null) {
    this.id = id;
    this.image = new Image();
    this.image.src = URL.createObjectURL(image);
    this.photoNumb = photoNumb.toString();
    this.description = description;
    this.copyOf = copyOf;
    this.hasCopy = hasCopy;
    this.blob = new Blob([image]);

    this.numb = numb;
    this.displayedNumb = (copyOf ? 'Copy of ' : '') + numb.toString();
  }

  updateNumb(newNumb) {
    this.numb = newNumb;
    this.displayedNumb = (this.copyOf ? 'Copy of ' : '') + newNumb.toString();
  }

  createPureCopy() {
    return new Photo(this.image, this.numb, this.photoNumb, this.description, this.id, this.copyOf, this.hasCopy);
  }

  createCopy() {
    return new Photo(this.blob, this.numb, this.photoNumb, '', -1, this.id);
  }

  getOrientation() {
    return (this.image.width > this.image.height) ? "landscape" : "portrait"
  }
}

DeleteConfirmDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func, 
  data: PropTypes.array,
  setData: PropTypes.func,
  deleteId: PropTypes.number,
  handleDelete: PropTypes.func,
  handleDeleteAll: PropTypes.func,
}

/**
 * Dialog to prompt user if they are sure they want to delete (all) the photo.
 * @param {Object} param0 
 * Note that for deleteId, < 0 means to delete all, > 0 means the index of the photo to delete,
 * and 0 is the default value
 * @returns React component
 */
function DeleteConfirmDialog({ open, setOpen, data, setData, deleteId, handleDelete, handleDeleteAll }) {

  const handleClose = () => {
    setOpen(false);
  };

  const deletePhoto = () => {

    let newData = [...data];

    // If it has a copy, the copy needs to be deleted as well
    if (data[deleteId].hasCopy) {
      newData = handleDelete(data.find((element) => element.id == data[deleteId].hasCopy), newData);
    }
    newData = handleDelete(data[deleteId], newData);

    setData(newData);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Permanently delete ${deleteId > 0 ? "photo" : "all"}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete { deleteId < 0 ? "all the photos" : "the photo" }? 
            This process cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteId < 0) {
                handleDeleteAll();
                handleClose();
              } else if (deleteId > 0) {
                deletePhoto();
                handleClose();
              } else console.log("ERROR: Invalid deleteId")
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddPhotoForm.propTypes = {
  openAddForm: PropTypes.bool,
  setOpenAddForm: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
}

// Modal for data entry
function AddPhotoForm({ openAddForm, setOpenAddForm, data, setData }) {

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

          const currentNumb = (data.length === 0) ? 0 : data.at(-1).numb;

          let newPhoto = new Photo(photo, +currentNumb + 1, newData.photoNumb, newData.description);
          addPhoto(newPhoto).then((newId) => {
            newPhoto.id = newId;
            setData([...data, newPhoto]);
          });

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

Table.propTypes = {
  error: PropTypes.object,
  setError: PropTypes.func,
  setClearAll: PropTypes.func,
  setCreateStack: PropTypes.func,
}

function Table({ error, setError, setClearAll, setCreateStack }) {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [validPhotoNumb, setValidPhotoNumb] = useState('');

  const [openAddForm, setOpenAddForm] = useState(false); // Holds if add photo form should be opened
  const [openDelete, setOpenDelete] = useState(false); // Holds if delete photo modal should be opened
  const [deleteId, setDeleteId] = useState(0); // Holds if need to delete all and the index of what to delete

  useEffect(() => {
    retrieveAll().then((items) => {
      let newData = items.map((entry) => {
        return new Photo(entry.image, entry.numb, entry.photoNumb, entry.description, entry.id, entry.copyOf, entry.hasCopy);
      });
      // Sort data based on photo number, and copy after original
      setData(newData.sort((a, b) => {
        if (a.numb == b.numb) {
          return a.copyOf ? 1 : -1;
        } 
        return (a.numb - b.numb);
        }
      ));
    });

    setPagination({
      pageSize: localStorage.getItem("pageSize") ? localStorage.getItem("pageSize") : 25,
      pageIndex: 0,
    })

  }, []);

  useEffect(() => {

    if (Object.keys(pagination).length !== 0) {
      localStorage.setItem("pageSize", pagination.pageSize);
    }

  }, [pagination]);

  // Saves the data in the data array into IndexedDB
  const updateCell = useCallback(async (columnID, photo, index, newValue) => {

    if (photo[columnID] == newValue) return; 
            
    let newData = [...data];

    newData[index][columnID] = newValue;
    updatePhoto(newData[index]);
    
    if (columnID == "photoNumb" && (photo.hasCopy || photo.copyOf)) {
      index = photo.hasCopy ? index + 1 : index - 1;
      newData[index][columnID] = newValue;
      updatePhoto(newData[index]);
    }

    setData(newData);
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'displayedNumb',
        header: '#',
        enableEditing: false,
        enableResizing: false,
        grow: false,
        size: 50,
      },
      {
        accessorKey: 'photoNumb',
        header: 'Photo Number',
        required: true,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validPhotoNumb,
          helperText: validPhotoNumb,
          onChange: (event) => {
            if (!event.target.value) {
              setValidPhotoNumb('Required');
            } else if (validPhotoNumb) {
              setValidPhotoNumb('');
            }
          },
          // TODO: On blur, if there's error, return to original and give error message
          onBlur: (event) => {
            if (!validPhotoNumb)
              updateCell(cell.column.id, row.original, +row.id, event.target.value);
          }
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        required: true,
        enableResizing: false,
        grow: 10,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          onBlur: (event) => {
            updateCell(cell.column.id, row.original, +row.id, event.target.value);
          }
        }),
      },
    ],
    [updateCell, validPhotoNumb],
  );

  // Handles what happens when the create copy button is clicked
  const createCopy = (image) => {
    
    let newCopy = image.createCopy();
    addPhoto(newCopy).then((newId) => {
      newCopy.id = newId;

      const originalIndex = data.indexOf(image);

      let newData = [...data];
      newData[originalIndex].hasCopy = newId;
      updatePhoto(image);

      newData.splice(originalIndex + 1, 0, newCopy);

      setData(newData);
    });
  }

  // Opens the delete modal, then handles the deletion of a photo
  const openDeleteConfirmModal = (deleteId, row=[]) => {
    
    if (!deleteId) {
      deleteId = data.indexOf(row.original);
    }
    
    setDeleteId(deleteId);
    setOpenDelete(true);
  
  };

  const handleDelete = (photo, data) => {
    
    deletePhoto(photo.id);
    let newData = data.filter((element) => {return (photo.id != element.id)});
    
    if (photo.copyOf) {

      const index = newData.findIndex((element) => element.id == photo.copyOf);
      newData[index].hasCopy = null;
      updatePhoto(newData[index]);
      return newData;
      
    } else {
      
      let wasCopy = false;

      for (let number = photo.numb, index = data.indexOf(photo);
        index < newData.length;
        number++, index++
      ) {
        if (newData[index].copyOf && !wasCopy) {
          number--;
          newData[index].updateNumb(number);
          wasCopy = true;
        } else {
          newData[index].updateNumb(number);
          wasCopy = false;
        }
        updatePhoto(newData[index]);
      }
      return newData;
    }
  }

  const handleDeleteAll = () => {
    clearAll();
    setData([]);
    setError({
      incidentNumb: '',
      bagNumb: '',
      location: '',
      postalCode: '',
      numbEntry: '',
    });
    setClearAll(true);
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
    autoResetPageIndex: false,
    initialState: {
      columnPinning: { right: ['mrt-row-actions'] },
    },
    layoutMode: 'grid-no-grow',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        grow: false,
      }
    },
    state: { pagination },
    onPaginationChange: setPagination,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();

        if (hoveredRow && draggingRow) {
          
          if (hoveredRow === draggingRow) return;

          if (data[hoveredRow.index].numb === data[draggingRow.index].numb) return;

          let drag = draggingRow.index;
          let hover = hoveredRow.index;
          
          let newData = [...data];
          let numbRowMove = 1;
          // If it has a copy, need to move the very next object as well.
          if (data[draggingRow.index].hasCopy) {
            numbRowMove = 2;
          }
          // If it is a copy, need to move the previous object as well.
          else if (data[draggingRow.index].copyOf) {
            numbRowMove = 2;
            drag--;
          }

          // The row that was dragged to cannot be between a copy and its original
          if (data[hoveredRow.index].hasCopy && hover > drag) {
            if (numbRowMove === 2) {
              hover += 1;
            } else if (numbRowMove === 1) {
              hover--;
            }
          } else if (data[hoveredRow.index].copyOf) {
            if (hover < data.length - 1) {
              if (numbRowMove === 2) {
                hover += 2;
              } else if (hover < drag) {
                hover++;
              }
            }
          } 

          if (hover === drag) return;
          
          const firstIndex = (drag > hover) ? hover : (hover - numbRowMove + 1);
          
          newData.splice(firstIndex, 0, ...newData.splice(drag, numbRowMove));
          
          const a = data[hoveredRow.index].copyOf ? data[hoveredRow.index].numb + 1 : data[hoveredRow.index].numb;
          const b = data[draggingRow.index].numb;

          // Updating the picture order numbers
          let wasCopy = false;

          for (let i = Math.min(a, b), max = Math.max(a, b), index = Math.min(drag, hover), maxIndex = data.length;
            i <= max, index < maxIndex;
            i++, index++
          ) {
            if (newData[index].copyOf && !wasCopy) {
              i--;
              newData[index].updateNumb(i);
              wasCopy = true;
            } else {
              newData[index].updateNumb(i);
              wasCopy = false;
            }
            updatePhoto(newData[index]);
          }
          setData(newData);
        }
      },
    }),
    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem
        icon={<Add />}
        key="add"
        label="Create Copy"
        disabled={ !!(row.original.hasCopy || row.original.copyOf) }
        onClick={() => {
          createCopy(row.original)}}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Delete"
        onClick={() => openDeleteConfirmModal(0, row)}
        table={table}
      />,
    ],
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color='primary'
          variant='contained'
          onClick={() => {

            let haveError = false;
            let newError = { ...error };

            if (data.length === 0) {
              newError = { ...newError, numbEntry: 'add at least one photo' };
              haveError = true;
            } else {
              newError = { ...newError, numbEntry: '' };
            }

            if (!localStorage.getItem("incidentNumb")) {
              newError = { ...newError, 'incidentNumb': 'Please key in the incident number'};
            }
            if (!localStorage.getItem('location')) {
              newError = { ...newError, 'location': "Please key in the location"};
            }

            for (const value of Object.values(newError)) {
              if (value) {
                haveError = true;
                setError(newError);
                setCreateStack(true);
                return;
              }
            }

            if (haveError) setCreateStack(true);
            else generateReport(data);
          }}
        >
          {'Generate Report'}
        </Button>
        <Button
          color='error'
          variant='contained'
          onClick={() => openDeleteConfirmModal(-1)}
          disabled={data.length == 0}
        >
          {'Delete All'}
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
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      !row.original.copyOf ? (
        <Box
          sx={{
            display: 'flex',
            margin: 'auto',
            width: '96vw',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={row.original.image.src} style={{'width' : '25%'}}></img>
        </Box>
      ) : null,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <AddPhotoForm
        data={data}
        setData={setData}
        openAddForm={openAddForm}
        setOpenAddForm={setOpenAddForm}
      />
      <DeleteConfirmDialog
        open={openDelete}
        setOpen={setOpenDelete}
        data={data}
        setData={setData}
        deleteId={deleteId}
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
      />
    </>
  )
};

export default Table;
