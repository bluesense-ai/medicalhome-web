import React from "react";
import DataTable from "react-data-table-component";
import * as utils from "../../../../common/utils/utils";

interface Patient {
  id: string;
  lastName: string;
  firstName: string;
  lookingFor: string;
  preferredClinic: string;
  joinedWaitlist: string;
  sex: string;
  dateOfBirth: string;
  preferred_provider_sex: string;
}

interface WaitlistTableProps {
  patients: Patient[];
  onSelectedRowsChange: (selectedRows: Patient[]) => void;
  onDelete: (patient: Patient) => void;
}

const WaitlistTable: React.FC<WaitlistTableProps> = ({ 
  patients, 
  onSelectedRowsChange, 
  onDelete 
}) => {
  

  // Function to format sex display
  const formatSex = (sex: string): string => {
    return sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase();
  };

  const columns = [
    {
      name: 'First Name',
      selector: (row: Patient) => row.firstName,
      sortable: true,
      center: true,
    },
    {
      name: 'Last Name',
      selector: (row: Patient) => row.lastName,
      sortable: true,
      center: true,
    },
    {
      name: 'Sex',
      selector: (row: Patient) => row.sex,
      sortable: true,
      center: true,
      cell: (row: Patient) => (
        <div className="py-2">
          <span className={`px-3 py-1 rounded-full text-sm `}>
            {formatSex(row.sex)}
          </span>
        </div>
      ),
    },
    {
      name: 'Age',
      selector: (row: Patient) => utils.calculateAge(row.dateOfBirth),
      sortable: true,
      center: true,
      cell: (row: Patient) => (
        <div className="py-2">
          <span className="text-gray-700">
            {utils.calculateAge(row.dateOfBirth)}
          </span>
        </div>
      ),
    },
    {
      name: 'Looking For',
      selector: (row: Patient) => row.lookingFor,
      sortable: true,
      center: true,
    },
    {
      name: 'Provider sex',
      selector: (row: Patient) => !row.preferred_provider_sex ? "" : row.preferred_provider_sex==="male" ? "Male" : "Female" ,
      sortable: true,
      center: true,
    },
    {
      name: 'Preferred Clinic',
      selector: (row: Patient) => row.preferredClinic,
      sortable: true,
      center: true,
    },
    {
      name: 'Joined Waitlist',
      selector: (row: Patient) => row.joinedWaitlist,
      sortable: true,
      center: true,
    },
    {
      name: 'Actions',
      cell: (row: Patient) => (
        <div className="flex items-center">
          <button
            onClick={() => onDelete(row)}
            className="text-teal-600 hover:text-teal-800"
          >
            <img src="/Icons/delete_forever.svg" alt="Delete" className="w-6 h-6" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#005164',
        color: 'white',
        fontSize: '14px',
        fontWeight: 500,
      },
    },
    rows: {
      style: {
        backgroundColor: '#f0f8ff',
        '&:hover': {
          backgroundColor: '#e6f3ff',
        },
      },
    },
    table: {
      style: {
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
      },
    },
    cells: {
      style: {
        paddingLeft: '10px',
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={patients}
      selectableRows
      selectableRowsVisibleOnly
      onSelectedRowsChange={({ selectedRows }) => onSelectedRowsChange(selectedRows)}
      customStyles={customStyles}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 20, 30]}
      defaultSortFieldId={1}
    />
  );
};

export default WaitlistTable;