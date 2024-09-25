import { useMemo, useState } from 'react';
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
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';

const initData = [{'numb': 1, 'photoNumb': 2, 'description': 'blah blah'}, {'numb': 2, 'photoNumb': 24, 'description': 'blah blah'}, {'numb': 3, 'photoNumb': 3, 'description': 'blah blah'}]

const Table = () => {
  //keep track of rows that have been edited
  const [editedRows, setEditedRows] = useState({});
  const [data, setData] = useState(initData);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'numb',
        header: '#',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'photoNumb',
        header: 'Photo Number',
        muiEditTextFieldProps: (row) => ({
          type: 'text',
          required: true,
          //store edited user in state to be saved later
          onChange: () => {
            setEditedRows({ ...editedRows, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        muiEditTextFieldProps: (row) => ({
          type: 'text',
          //store edited user in state to be saved later
          onChange: () => {
            setEditedRows({ ...editedRows, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: (row) => ({
          type: 'email',
          required: true,
          //store edited user in state to be saved later
          onChange: () => {
            setEditedRows({ ...editedRows, [row.id]: row.original });
          },
        }),
      }
    ],
    [editedRows],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    useUpdateUsers();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({
    values,
    table,
  }) => {
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUsers = async () => {
    await updateUsers(Object.values(editedRows));
    setEditedRows({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: initData,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          if (hoveredRow && draggingRow) {
            data.splice(
              (hoveredRow).index,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      }),
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableColumnPinning: true,
    enableEditing: true,
    enableRowActions: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowSave: handleCreateUser,
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
          onClick={handleSaveUsers}
          disabled={
            Object.keys(editedRows).length === 0
          }
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : 'Save'}
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
        Create New User
      </Button>
    ),
    initialState: {
      columnPinning: {
        right: ['mrt-row-actions'],
      },
    },
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook
function useCreateUser() {
  
}

//READ hook (get users from api)
function useGetUsers() {
  
}

//UPDATE hook (put user in api)
function useUpdateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (users) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUsers) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((u) => u.id === user.id);
          return newUser ? newUser : user;
        }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>
);

export default ExampleWithProviders;