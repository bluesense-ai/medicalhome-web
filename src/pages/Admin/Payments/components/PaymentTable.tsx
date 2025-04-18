import React,{useMemo} from "react";
import DataTable from "react-data-table-component";
import * as utils from "../../../../common/utils/utils";
import { Payment } from "../types";
import { useState } from "react";



interface PaymentTableProps {
  payments: Payment[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {


  const [paymentList, ] = useState<Payment[]>(payments);

  const sortedPayments = useMemo(() => {
    return [...paymentList].sort((a, b) => {
      if (a.payment_status === "recurring" && b.payment_status !== "recurring") {
        return -1; // Place "recurring" at the top
      }
      if (a.payment_status !== "recurring" && b.payment_status === "recurring") {
        return 1; // Place others below
      }
      return 0; // Maintain order for others
    });
  }, [payments]);

  const getCapitalizedText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recurring":
        return "bg-[#F6B818]";
      case "Out of Office":
        return "bg-[#F6B818]";

      case "completed":
        return "bg-[#9CF200]";
      case 'On call':
        return "bg-[#CC2B29]";
      default:
        return "bg-gray-500";
    }
  };

  const getMembersText = (package_details: any) => {

      const parsedPackage = JSON.parse(package_details);
      if(parsedPackage.min_members && parsedPackage.max_members)
      {
          return parsedPackage.min_members+" - "+ parsedPackage.max_members +" Members";
      }
      
    
    return "";
  };
const getCardNumber = (row: Payment) => {
   const data =  JSON.parse(row.payment_details)?.ssl_card_number;
  if(data)
  {
    return data;
  }else{
    return JSON.parse(row.payment_details)?.txn?.ssl_card_number[0] || "";
  }
}
  const columns = [
    {
      name: "Invoice ID",
      selector: (row: Payment) => `${row.invoice_number}`,
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Buyer Name",
      selector: (row: Payment) => row.buyer_name,
      sortable: true,
    },
    {
      name: "Card Number",
      selector: (row: Payment) => getCardNumber(row),
      sortable: true,
    },
    {
      name: "Members Allowed",
      selector: (row: Payment) => getMembersText(row.package_details),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: Payment) => (
        <div className="flex items-center ml-4">
          <span
            className={`w-4 h-4 rounded-full mr-2 ${getStatusColor(
              row.payment_status
            )}`}
          ></span>
          {getCapitalizedText(row.payment_status)}
        </div>
      ),
      width: "140px",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Payment) =>  utils.formatDate(row.payment_date),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: Payment) =>  "$"+row.amount,
      sortable: true,
    },
    {
      name: "Package Name",
      selector: (row: Payment) => JSON.parse(row.package_details).name || "",
      sortable: true,
    },
   
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#005164",
        color: "white",
        fontWeight: "semi-bold",
      },
    },
    headCells: {
      style: {
        justifyContent: "center",
        fontSize: "16px",
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
    cells: {
      style: {
        justifyContent: "center", 
      },
    },
    table: {
      style: {
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={sortedPayments}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        paginationComponentOptions={paginationComponentOptions}
        customStyles={customStyles}
      />
    </>
  );
};

export default PaymentTable;
