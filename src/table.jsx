import { useMemo, useState } from 'react';
import {

} from './'
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
  {numb: 1, photoNumb: 2, description: 'blah'},
  {numb: 2, photoNumb: 24, description: 'blah blah'},
  {numb: 3, photoNumb: 3, description: 'blah blah blah'}
];

const Table = () => {

  const [data, setData] = useState(() => initData);
  const [editedRows, setEditedRows] = useState();

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'numb', //access nested data with dot notation
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
            setEditedRows({ ...editedRows, [row.id]: row.original});
          }
        }),
      },
      {
        accessorKey: 'description', //normal accessorKey
        header: 'Description',
        size: 400,
        muiEditTextFieldProps: ({ row }) => ({
          type: 'text',
          required: true,
          onBlur: () => {
            setEditedRows({ ...editedRows, [row.id]: row.original});
            console.log(row.getAllCells());
            console.log(row.original);
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

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: 'cell',
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          data.splice(
            hoveredRow.index, 0, data.splice(draggingRow.index, 1)[0]
          );
          setData([...data]);
        }
      },
    }),
  });

  return <MaterialReactTable table={table} />;
};

// Saves the rows into the database
// Note: update to change to database
function updatePictures(row) {
  
}

function deletePicture() {

}

export default Table;
