import { useMemo, useState } from 'react';
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
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Object to hold the required information of each photo
function Photo(image, numb, photoNumb, description, id = -1, copyOf = null, isCopyOf = null) { // Note that image is of type Image
  this.id = id;
  this.image = image;
  this.url = image.src = URL.createObjectURL(image);
  this.orientation = (image.width > image.height ? "landscape" : "portrait");
  this.numb = numb;
  this.photoNumb = photoNumb;
  this.description = description;
  this.copyOf = copyOf;
  this.isCopyOf = isCopyOf;
}

const initData = [
  {numb: '1', photoNumb: 2, description: 'blah', id: 2},
  {numb: 'Copy of 1', photoNumb: 2, description: 'blah', id: 3},
  {numb: '2', photoNumb: 24, description: 'blah blah', id: 4},
  {numb: '3', photoNumb: 3, description: 'blah blah blah', id: 5}
];

const Table = () => {

  const [data, setData] = useState(() => initData);
  const [editedRows, setEditedRows] = useState({});
  let rowOrderChanged = false;

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
            setEditedRows({ ...editedRows, [row.getValue('id')]: row.original});
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
            setEditedRows({ ...editedRows, [row.getValue['id']]: row.original});
          }
        }),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
      },
    ],
    [editedRows],
  );

  const handleSave = async () => {
    await updatePictures((editedRows)); 
    setEditedRows({});
  }

  const createEntry = async () => {

  }

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deletePhoto(); 
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
    initialState: {
      columnVisibility: { id: false },
      columnPinning: { right: ['mrt-row-actions'] },
    },
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          let newData = structuredClone(data);
          newData.splice(
            hoveredRow.index, 0, newData.splice(draggingRow.index, 1)[0]
          );

          let a = data[hoveredRow.index].numb;
          let b = data[draggingRow.index].numb;

          // Updating the picture order numbers
          for (let i = Math.min(a, b) - 1; i < Math.max(a, b); i++) {
            console.log(newData[i].numb.trim);
            if (newData[i].numb.trim[0].lower() === 'c') {
              newData[i].numb = `Copy of Photo ${i}` // TODO: Fix bug for not changing column
              i--;
            } else {
              newData[i].numb = i + 1;
            }
          }
          console.log(newData);
          setData([...newData]);
        }
      },
    }),
    onCreatingRowSave: createEntry,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); 
        }}
      >
        Upload Photo
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};

// Saves the rows into the database
function updatePictures(row) {
  
}

function deletePicture() {

}

export default Table;
