import React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

import { DataGrid } from '@mui/x-data-grid';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9)
// ];

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

// function getColumns()

function DataTable({ columnNames }) {
  console.log(columnNames);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        // rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
    // <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //     <TableHead>
    //       <TableRow>
    //         {columnNames.map((colName) => (
    //           <TableCell key={colName} align="right">
    //             {colName}
    //           </TableCell>
    //         ))}
    //       </TableRow>
    //     </TableHead>
    //     {/* <TableBody>
    //       {rows.map((row) => (
    //         <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    //           <TableCell component="th" scope="row">
    //             {row.name}
    //           </TableCell>
    //           <TableCell align="right">{row.calories}</TableCell>
    //           <TableCell align="right">{row.fat}</TableCell>
    //           <TableCell align="right">{row.carbs}</TableCell>
    //           <TableCell align="right">{row.protein}</TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody> */}
    //   </Table>
    // </TableContainer>
  );
}

export default DataTable;
