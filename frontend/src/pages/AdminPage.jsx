import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createNewAdmin } from '../queries/admin-queries';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
  }
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];

const username = 'admin';
const password = 'admin123';
const email = 'seba.tum2022@gmail.com';

function AdminPage() {
  const [selectedRows, setSelectedRows] = useState();
  const [value, setValue] = React.useState('1');

  const adminData = {
    username,
    password,
    email
  };
  const onSubmitClickedUser = async () => {
    try {
      const newAdmin = await createNewAdmin(adminData);
      console.log(newAdmin);
    } catch (e) {
      console.error(`failed to create user ${e}`);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelection = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = rows.filter((row) => selectedIDs.has(row.id));
    setSelectedRows(selectedRowData);
  };

  console.log(selectedRows);

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: 1 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Withdraw Requests" value="1" />
            <Tab label="Partner Location Signup Request" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: '80vh',
              padding: 2
            }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: '80vh',
              padding: 2
            }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(ids) => {
                handleSelection(ids);
              }}
            />
          </Box>
        </TabPanel>
      </TabContext>
      <Button onClick={onSubmitClickedUser}>Sign Up</Button>
    </Box>
  );
}

export default AdminPage;
