import React from "react";
import DataTable from "react-data-table-component";
import * as utils from "../../../../common/utils/utils";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  sex: string;
  date_of_birth: string;
  email_address: string;
  health_card_number: string;
  phone_number: string;
  age: string;
  preferred_clinic: any;
  most_visited_clinic: any;
  next_appointment_date: string;


}

interface PatientTableProps {
  patients: Patient[];
  onSelectedRowsChange: (selectedRows: Patient[]) => void;
  onDelete: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectedRowsChange,
  onDelete,
}) => {
  const columns = [
    {
      name: "First Name",
      selector: (row: Patient) => row.first_name || "",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: Patient) => row.last_name || "",
      sortable: true,
    },
    {
      name: "Age",
      selector: (row: Patient) => utils.calculateAge(row.date_of_birth) || "",
      sortable: true,
    },
    {
      name: "Sex",
      selector: (row: Patient) => row.sex || "",
      sortable: true,
    },
    {
      name: "Preferred Clinic",
      selector: (row: Patient) => row.preferred_clinic?.name || "",
      sortable: true,
    },
    {
      name: "Most Visited",
      selector: (row: Patient) => row.most_visited_clinic?.name || "",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Patient) => (
        <div className="flex items-center ">
          <button
            onClick={() => onDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            <img
              src="/Icons/delete_forever.svg"
              alt="Delete"
              className="w-5 h-5"
            />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#005164",
        color: "white",
        fontSize: "14px",
        fontWeight: 500,
        justifyContent: "center",
      },
    },
    rows: {
      style: {
        backgroundColor: "#f0f8ff",
        "&:hover": {
          backgroundColor: "#e6f3ff",
        },
      },
    },
    table: {
      style: {
        borderTopLeftRadius: "0.5rem",
        borderTopRightRadius: "0.5rem",
      },
    },
    cells: {
      style: {
    
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={patients}
      selectableRows
      selectableRowsVisibleOnly
      onSelectedRowsChange={({ selectedRows }) =>
        onSelectedRowsChange(selectedRows)
      }
      customStyles={customStyles}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 20, 30]}
    />
  );
};

export default PatientTable;
