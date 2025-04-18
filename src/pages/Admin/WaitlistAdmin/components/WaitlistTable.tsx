import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth: string;
  preferred_clinic: string | null;
  preferred_provider: string | null;
  registered: boolean;
  createdAt: string;
}

interface WaitlistTableProps {
  patients: Patient[];
  onSelectedRowsChange: (selectedRows: Patient[]) => void;
}

const WaitlistTable: React.FC<WaitlistTableProps> = ({ patients, onSelectedRowsChange }) => {
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayValue = (value: string | null | undefined, defaultValue: string = "N/A"): string => {
    return value || defaultValue;
  };

  const getFullName = (firstName: string, lastName: string): string => {
    return `${displayValue(firstName)} ${displayValue(lastName)}`.trim();
  };

  const columns: TableColumn<Patient>[] = [
    {
      name: 'Last Name',
      selector: row => displayValue(row.last_name),
      sortable: true,
      center: true,
      cell: row => (
        <div className="py-2">
          <span className="text-gray-900">{displayValue(row.last_name)}</span>
        </div>
      ),
    },
    {
      name: 'Name',
      selector: row => getFullName(row.first_name, row.last_name),
      sortable: true,
      center: true,
      cell: row => (
        <div className="py-2">
          <span className="text-gray-900">{getFullName(row.first_name, row.last_name)}</span>
        </div>
      ),
    },
    {
      name: 'Preferred Provider',
      selector: row => displayValue(row.preferred_provider, "Unknown Provider"),
      sortable: true,
      center: true,
      cell: row => (
        <div className="py-2">
          <span className="text-gray-700">{displayValue(row.preferred_provider, "Unknown Provider")}</span>
        </div>
      ),
    },
    {
      name: 'Preferred Clinic',
      selector: row => displayValue(row.preferred_clinic, "Unknown Clinic"),
      sortable: true,
      center: true,
      cell: row => (
        <div className="py-2">
          <span className="text-gray-700">{displayValue(row.preferred_clinic, "Unknown Clinic")}</span>
        </div>
      ),
    },
    {
      name: 'Joined Waitlist',
      selector: row => row.createdAt,
      sortable: true,
      center: true,
      cell: row => (
        <div className="py-2">
          <span className="text-gray-700">{formatDate(row.createdAt)}</span>
        </div>
      ),
    },
  ];
  const customStyles = {
    table: {
      style: {
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
      },
    },
    tableWrapper: {
      style: {
        display: 'table',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#005164',
        color: 'white',
        minHeight: '52px',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    headCells: {
      style: {
        color: 'white',
        fontSize: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    rows: {
      style: {
        backgroundColor: '#f9fafb',
       
        '&:hover': {
          backgroundColor: '#f3f4f6',
          cursor: 'pointer',
        },
        minHeight: '48px',
      },
    },
    pagination: {
      style: {
        backgroundColor: 'white',
        fontSize: '14px',
        color: '#374151',
        borderTop: '1px solid #e5e7eb',
      },
      pageButtonsStyle: {
        borderRadius: '4px',
        height: '32px',
        minWidth: '32px',
        padding: '0 6px',
        margin: '0 4px',
        cursor: 'pointer',
        transition: '0.2s',
        color: '#374151',
        fill: '#374151',
        backgroundColor: 'transparent',
        '&:disabled': {
          cursor: 'unset',
          color: '#9ca3af',
          fill: '#9ca3af',
        },
        '&:hover:not(:disabled)': {
          backgroundColor: '#f3f4f6',
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: '#f3f4f6',
        },
      },
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        color: '#6b7280',
        backgroundColor: 'white',
      },
    },
    progress: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        backgroundColor: 'white',
      },
    },
    selectableRows: {
      style: {
        backgroundColor: 'white',
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  const noDataComponent = (
    <div className="flex flex-col items-center justify-center p-8">
     
      <p className="text-gray-500 text-lg">No patients found</p>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={patients}
      selectableRows
      onSelectedRowsChange={({ selectedRows }) => onSelectedRowsChange(selectedRows)}
      customStyles={customStyles}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
      paginationComponentOptions={paginationComponentOptions}
      noDataComponent={noDataComponent}
      persistTableHead
      striped
      highlightOnHover
      pointerOnHover
      responsive
    />
  );
};

export default WaitlistTable;