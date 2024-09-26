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
  MRT_ActionMenuItem,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

// Object to hold the required information of each photo
function Photo(image, numb, photoNumb, description, id = -1, copyOf = null, hasCopy = false) { // Note that image is of type Image
  this.id = id;
  this.image = image;
  this.url = image.src = URL.createObjectURL(image);
  this.orientation = (image.width > image.height ? "landscape" : "portrait");
  this.numb = numb;
  this.photoNumb = photoNumb;
  this.description = description;
  this.copyOf = copyOf;
  this.hasCopy = hasCopy;
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
              newData[i].numb = `Copy of Photo ${i}` // TODO: Fix bug for not changing row number
              i--;
            } else {
              newData[i].numb = i + 1;
            }
          }
          setData([...newData]);
        }
      },
    }),
    onCreatingRowSave: createEntry,
    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem //or just use a normal MUI MenuItem component
        icon={<Edit />}
        key="edit"
        label="Edit"
        onClick={() => console.info('Edit')}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Delete"
        onClick={() => console.info('Delete')}
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
          <img src='https://www.elegantthemes.com/blog/wp-content/uploads/2015/02/custom-trackable-short-url-feature.png'></img>
        </Box>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

// Saves the rows into the database
function updatePictures(row) {
  
}

function deletePicture() {

}

export default Table;
