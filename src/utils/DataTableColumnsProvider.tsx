import { Button, IconButton } from "@mui/material";
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import {  Edit } from "lucide-react";
import { getFormattedDate } from './common';
import { MemberDetails } from "../store/store";



export const getUserDashboardTableColumns = () => [
  {
    selector: (row: any) => row.title,
    style: { fontWeight: "bold" },
  },
  {
    name: "Direct",
    selector: (row: any) => row.direct,
    center: true,
  },
  {
    name: "Indirect",
    selector: (row: any) => row.indirect,
    center: true,
  },
  {
    name: "Total",
    selector: (row: any) => row.total,
    center: true,
  },
];

export const getUsedPackageColumns = (user : MemberDetails) => {
  return [
    {
      name: "Date",
      selector: (row: any) => getFormattedDate(row.date),
      sortable: true,
      width : "10%"
    },
    {
      name: "Member Code",
      selector: (row: any) => `${user.Name} (${row.purchasedby})`,
      sortable: true,
      width : "20%"
    },
    {
      name: "Package Code",
      selector: (row: any) => row.epin_no,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: any) => `₹ ${row.amount.toLocaleString()}` ,
      sortable: true,
    },
    {
      name: "Used For",
      selector: (row: any) => row.used_for,
      sortable: true,
      width : "20%"
    },
    {
      name: "Used Date",
      selector: (row: any) => getFormattedDate(row.used_on),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: any) =>  row.status.charAt(0).toUpperCase() + row.status.slice(1),
      sortable: true,
    },
  ];
};

export const getUnUsedPackageColumns = (user : MemberDetails) => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
    width : "12%"
  },
  {
    name: "Code",
    selector: (row: any) => `${user.Name} (${row.purchasedby})`,
    sortable: true,
  },
  {
    name: "Package Code",
    selector: (row: any) => row.epin_no,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => `₹ ${row.amount.toLocaleString()}`,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status.charAt(0).toUpperCase() + row.status.slice(1),
    sortable: true,
  },
];

export const getUserPackageHistoryColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
  },
  {
    name: "Transfered To",
    selector: (row: any) => row.transfered_to,
    // #TODO: Add username and member id
    sortable: true,
  },
  {
    name: "Qty",
    selector: (row: any) => row.quantity,
    sortable: true,
  },
  {
    name: "Package",
    selector: (row: any) => row.package,
    sortable: true,
  },
];

export const getDirectColumns = () => [
  {
    name: "S No",
    cell: (_: any,index: number) => index + 1,
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) =>`${row.Name} - ${row.Member_id}`,
    sortable: true,
  },
  {
    name: "Mobile No",
    selector: (row: any) => row.mobileno,
    sortable: true,
  },
  {
    name: "DOJ",
    selector: (row: any) => getFormattedDate(row.Date_of_joining),
    sortable: true,
  },
  {
    name: "Sponsor",
    selector: (row: any) => `${row.Sponsor_name} - ${row.Sponsor_code}`,
    sortable: true,
  },
];

export const getLevelBenifitsColumns = () => [
  {
    name: "Date",
    selector: (row: any) =>  getFormattedDate(row.date),
    sortable: true,
  },
  {
    name: "Payout Level",
    selector: (row: any) => row.payoutLevel,
    sortable: true,
  },
  {
    name: "Members",
    selector: (row: any) => row.members,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => row.amount,
    sortable: true,
  },
];

export const getDailyPayoutColumns = () => [
  {
    name: "Date",
    selector: (row: any) => row.date,
    sortable: true,
  },
  {
    name: "Level Benefits",
    selector: (row: any) => row.level_benefits,
    sortable: true,
    cell: (row: any) => `${row.level_benefits}`
  },
  {
    name: "Direct Benefits",
    selector: (row: any) => row.direct_benefits,
    sortable: true,
    cell: (row: any) => `${row.direct_benefits}`
  },
  {
    name: "Gross Profit",
    selector: (row: any) => row.gross_profit,
    sortable: true,
    cell: (row: any) => `${row.gross_profit}`
  },
];

export const getTransactionColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.transaction_date),
    sortable: true,
  },
  {
    name: "Description",
    selector: (row: any) => row.description,
    sortable: true,
  },
  {
    name: "Credit",
    selector: (row: any) => row.ew_credit ? `₹ ${parseFloat(row.ew_credit).toLocaleString()}` : "-",
    sortable: true,
  },
  {
    name: "Debit",
    selector: (row: any) => row.ew_debit ? `₹ ${parseFloat(row.ew_debit).toLocaleString()}` : "-",
    sortable: true,
  },
  {
    name: "Due Amount",
    selector: (row: any) => row.net_amount ? `₹ ${parseFloat(row.net_amount).toLocaleString()}` : "-",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          color: row.status?.toLowerCase() === "active" ? "#569f35" : "#ff3860",
          padding: "5px 10px",
          borderRadius: "4px",
        }}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </div>
    ),
  },
];



export const getWalletColumns = () => [
  {
    name: "Date",
    selector: (row: any) => row.transaction_date, 
    sortable: true,
    cell: (row : any) => new Date(row.transaction_date).toLocaleDateString()
  },
  {
    name: "Transaction ID",
    selector: (row: any) => row.transaction_id, 
    sortable: true,
  },
  {
    name: "Type",
    selector: (row: any) => row.transaction_type, 
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => row.ew_debit, 
    sortable: true,
    cell: (row: any) => {
     
      if (parseFloat(row.ew_debit) > 0) {
        return `-₹${parseFloat(row.ew_debit).toFixed(2)}`;
      } else {
        return `+₹${parseFloat(row.ew_credit).toFixed(2)}`;
      }
    }
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
    cell: (row: any) => row.status.charAt(0).toUpperCase() + row.status.slice(1) 
  }
];

export const getAdminDashboardTableColumns : any = () => [
  {
    name: "Date",
    selector: (row: any) => {
      const date = new Date(row.Date_of_joining || row.date);
      return isNaN(date.getTime()) ? row.Date_of_joining || "-" : date.toLocaleDateString();
    },
    center: true,
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.Name || row.Member || "-",
    center: true,
    sortable: true,
  },
  {
    name: "Package Amount",
    selector: (row: any) => (row.package_value ? `₹${row.package_value}` : "-"),
    center: true,
    sortable: true,
  },
];


export const getMembersColumns = (showEdit : boolean , handleEditClick: (memberId: string) => void) => [
  {
    name: "SNo",
    selector: (row: any) => row.sNo,
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.Member_id,
    sortable: true,
  },
  {
    name: "Approved On",
    selector: (row: any) => getFormattedDate(row.Date_of_joining),
    sortable: true,
  },
  {
    name: "Password",
    selector: (row: any) => row.password,
    sortable: true,
  },
  {
    name: "Sponsor",
    selector: (row: any) => row.Sponsor_name ?? '-',
    sortable: true,
  },
  {
    name: "Package",
    selector: (row: any) => row.spackage,
    sortable: true,
  },
  {
    name: "MobileNo",
    selector: (row: any) => row.mobileno,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          color: row.status === 'active' ? 'green' : row.status.toLowerCase() === 'pending' ? '#ffd700' : 'red',
          
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </div>
    ),
  },
  {
    name: 'Modify',
    omit : !showEdit,
    cell: (row:any) => (
      <IconButton onClick={()=> handleEditClick(row.Member_id)} style={{ color: '#000', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>
        <Edit />
      </IconButton>
    ),
    
  }
];

export const getPendingMembersColumns = (
    handleActivateClick: (memberId: string) => void,
  isActivating: boolean
) => [
  {
    name: "SNo",
    selector: (row: any) => row.sNo,
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.Member_id,
    sortable: true,
  },
  {
    name: "Approved On",
    selector: (row: any) => getFormattedDate(row.Date_of_joining),
    sortable: true,
  },
  {
    name: "Password",
    selector: (row: any) => row.password,
    sortable: true,
  },
  {
    name: "Sponsor",
    selector: (row: any) => row.Sponsor_name ?? "-",
    sortable: true,
  },
  {
    name: "MobileNo",
    selector: (row: any) => row.mobileno,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          color:
            row.status.toLowerCase() === "active"
              ? "green"
              : row.status.toLowerCase() === "pending"
              ? "#ffd700"
              : "red",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </div>
    ),
  },
  {
    name: "Action",
    omit: false,
    cell: (row: any) =>
      row.status.toLowerCase() === "inactive" ? (
        <div style={{ color: "red", fontWeight: 500 }}>
          Cannot Activate
        </div>
      ) : (
        <Button
          onClick={() => handleActivateClick(row.Member_id)}
          disabled={isActivating}
          variant="contained"
          sx={{
            backgroundColor: "#51cf66",
            "&:hover": { backgroundColor: "#3bcf57" },
            color: "#000",
            padding: "2px",
            cursor: "pointer",
            textTransform:"capitalize"
          }}
        >
          Active
        </Button>
      ),
  },
];


export const getSupportTicketColumns = (handleOpenDialog : any) =>  [
  {
    name: 'Member',
    selector: (row: any) => row.reference_id,
    sortable: true,
  },
  {
    name: 'Ticket Date',
    selector: (row: any) => getFormattedDate(row.ticket_date),
    sortable: true,
  },
  {
    name: 'Ticket No',
    selector: (row: any) => row.ticket_no,
    sortable: true,
  },
  
  {
    name: 'Type of ticket',
    selector: (row: any) => row.type_of_ticket,
    sortable: true,
  },
  {
    name: 'Subject',
    selector: (row: any) => row.SUBJECT,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row: any) => row.ticket_status,
    cell: (row: any) => (
      <span
        style={{
          color: row.ticket_status === 'pending' ? '#CC5500' : '#008000',
          padding: '0.5rem',
          borderRadius: '4px',
          
        }}
      >
        {row.ticket_status?.charAt(0).toUpperCase() + row.ticket_status?.slice(1)}
      </span>
    ),
    sortable: true,
  },
  {
    name: 'Action',
    cell: (row: any) => (
      <Button
        variant="contained"
        onClick={() => handleOpenDialog(row)}
        sx={{
          backgroundColor: '#2c8786',
          '&:hover': { backgroundColor: '#581c87' }
        }}
      >
        Reply
      </Button>
    ),
  },
];

export const getusedandUnUsedColumns = () => [
  {
    name: "Member Code",
    selector: (row: any) => row.memberCode,
    sortable: true,
  },
  {
    name: "Used Quantity",
    selector: (row: any) => row.usedQuantity,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
  },
];

export const getAdminPackageHistoryColumns = () => [
  {
    name : "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
  },
  {
    name : "Member",
    selector: (row: any) => row.memberCode,
  },
  {
    name : "Quantity",
    selector: (row: any) => row.totalQuantity,
  }

]

export const getMailBoxColumns = (handleOpenDialog : any) => [
  {
    name: 'Ticket Date',
    selector: (row: any) => getFormattedDate(row.ticket_date),
    sortable: true,
  },
  {
    name: 'Ticket No',
    selector: (row: any) => row.ticket_no,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          backgroundColor: '#5bc0de',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {row.ticket_no}
      </div>
    ),
  },
  {
    name: 'Type of ticket',
    selector: (row: any) => row.type_of_ticket,
    sortable: true,
  },
  {
    name: 'Subject',
    selector: (row: any) => row.SUBJECT,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row: any) => row.ticket_status,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
         color: row.ticket_status?.toLowerCase() === 'pending' ? '#fb741a' : '#569f35',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        {row.ticket_status?.charAt(0).toUpperCase() + row.ticket_status?.slice(1)}
      </div>
    ),
  },
  {
    name: 'Actions',
    cell: (row: any) => (
      <IconButton
        onClick={() => handleOpenDialog(row)}
        size="medium"
        sx={{
          color: '#2c8786',
          '&:hover': {
            backgroundColor: 'rgba(4, 17, 47, 0.04)'
          }
        }}
      >
        <VisibilityIcon color='primary' fontSize="medium"/>
      </IconButton>
    ),
    sortable: false,
  },
];

export const getAdminPageTransactionColumns = () => [
  {
    name: "Date",
    selector: (row: any) =>getFormattedDate(row.transaction_date),
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.member_id,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row: any) => row.description,
    sortable: true,
  },
  {
    name: "Type",
    selector: (row: any) => row.transaction_type,
    sortable: true,
  },
  {
    name: "EW Credit",
    selector: (row: any) => row.ew_credit,
    sortable: true,
  },
  {
    name: "EW Debit",
    selector: (row: any) => row.ew_debit,
    sortable: true,
  },
];

export const getSMSTransactionColumns = () => [
  {
    name: "Date",
    selector: (row: any) => row.date,
    sortable: true,
  },
  {
    name: "ID",
    selector: (row: any) => row.id,
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.member,
    sortable: true,
  },
  {
    name: "Message Type",
    selector: (row: any) => row.messageType,
    sortable: true,
  },
  {
    name: "Sent To",
    selector: (row: any) => row.sentTo,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    sortable: true,
  },
];

export const getNewsColumns = () => [
  {
    name: "From Date",
    selector: (row: any) => getFormattedDate(row.from_date),
    sortable: true,
  },
  {
    name: "To Date",
    selector: (row: any) => getFormattedDate(row.to_date),
    sortable: true,
  },
  {
    name: "Content",
    selector: (row: any) => row.news_details,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    cell: (row: any) => (
      <span
        style={{
          color: row.status === "active" ? "#569f35" : "transparent",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
    sortable: true,
  },
];

export const getHolidaysColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.holiday_date),
    sortable: true,
  },
  {
    name: "Description",
    selector: (row: any) => row.holiday_desc,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status,
    cell: (row: any) => (
      <span
        style={{
          color: row.status === "active" ? "#569f35" : "transparent",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
    sortable: true,
  },
];

export const getRequestColumns = (approveTrasaction: (id : any) => void) =>[
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.transaction_date) || "-",
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.member_id || "-",
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) =>row.memberDetails.mobileno || "-",
    sortable: true,
  },
  {
    name: "Account No.",
    selector: (row: any) => row.memberDetails.account_number|| "-",
    sortable: true,
  },
  {
    name: "IFSC Code",
    selector: (row: any) => row.memberDetails.ifsc_code || "-",
    sortable: true,
  },
  {
    name: "Paid Amount",
    selector: (row: any) => row.ew_debit || "-",
    sortable: true,
  },
  {
    name: "Deducted",
    selector: (row: any) => row.deduction || "-",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status || "-",
    sortable: true,
  },
  {
    name: "Action",
    selector: (_row: any) => {
      return (
        <>
        <Button variant="contained" onClick={()=>approveTrasaction(_row.transaction_id)}>Approve</Button> 
        </>
      )
    },
    sortable: true,
  },
]

export const getProccessedColumns = () =>[
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.transaction_date) || "-",
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.member_id || "-",
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) =>row.memberDetails?.mobileno || "-",
    sortable: true,
  },
  {
    name: "Account No.",
    selector: (row: any) => row.memberDetails?.account_number || "-",
    sortable: true,
  },
  {
    name: "IFSC Code",
    selector: (row: any) => row.memberDetails?.ifsc_code || "-",
    sortable: true,
  },
  {
    name: "Paid Amount",
    selector: (row: any) => row.net_amount || "-",
    sortable: true,
  },
  {
    name: "Deducted",
    selector: (row: any) => row.deduction || "-",
    sortable: true,
  },
  
]

export const getPayblesColumns = () =>[
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.Member,
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) =>row.mobileno,
    sortable: true,
  },
  {
    name: "Account No.",
    selector: (row: any) => row.account,
    sortable: true,
  },
  {
    name: "IFSC Code",
    selector: (row: any) => row.ifsc,
    sortable: true,
  },
  {
    name: "Payble Amount",
    selector: (row: any) => row.amount,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row: any) => row.action,
    sortable: true,
  },
  
]

export const getCashBackColumns = () =>[
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
  },
  {
    name: "Member",
    selector: (row: any) => row.Member,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => row.amount,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row: any) => row.action,
    sortable: true,
  },
]

export const getMultiLevelColumns = () => [
  {
    name: "Level",
    selector: (row: any) => `Level ${row.level}`,
    sortable: true,
  },
  {
    name: "Total ",
    selector: (row: any) => row.total,
    sortable: true,
  },
  {
    name: "Active ",
    selector: (row: any) => row.active,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
        }}
      >
        {row.active}
      </div>
    ),
  },
  {
    name: "Pending ",
    selector: (row: any) => row.pending,
    sortable: true,
    cell: (row: any) => (
      <div
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
        }}
      >
        {row.pending}
      </div>
    ),
  },
];


export const getAdminDailyBenifitsColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date),
    sortable: true,
  },
  {
    name: "Member ID",
    selector: (row: any) => row.member_id || "N/A",
    sortable: true,
  },
  {
    name: "Gross Profit",
    selector: (row: any) => row.gross_profit || "0.00",
    sortable: true,
    format: (row: any) => `₹${parseFloat(row.gross_profit || 0).toFixed(2)}`,
  },
 
];


export const getAdminLevelBenifitsColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.date || row.createdAt || row.transactionDate),
    sortable: true,
  },
  {
    name: "Payout Level",
    selector: (row: any) => row.payoutLevel || row.level || row.description || "N/A",
    sortable: true,
  },
  {
    name: "Sponser_id",
    selector: (row: any) => row.member_id || row.memberName || row.userId || row.user?.name || "N/A",
    sortable: true,
  },
   {
    name: "memberId",
    selector: (row: any) => row.related_member_id || row.memberName || row.userId || row.user?.name || "N/A",
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => row.daily_earnings.gross_profit || row.amount || row.benefitAmount || "0",
    sortable: true,
    format: (row: any) => `$${parseFloat(row.amount || row.ew_credit || row.benefitAmount || 0).toFixed(2)}`,
  },
];


const TABLE_ROW_CUSTOM_STYLE = {
  style: {
    fontFamily: "Bogle-Regular",
    "&:last-child": {
      borderBottom: "1px solid rgba(0,0,0,.12)",
    },
  },
};
export const DASHBOARD_CUTSOM_STYLE = {
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: "Bogle-Bold",
      backgroundColor: "#2c8786",
      color: "#fff",
      border: "none",
    },
  },
  rows: {
    style: {
      ...TABLE_ROW_CUSTOM_STYLE,
    },
  },
};


export const getPendingLoansColumns = (processLoan: (memberId: string, action: 'approve' | 'reject') => void) => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.transaction_date) || "-",
    sortable: true,
  },
  {
    name: "Member ID",
    selector: (row: any) => row.member_id || "-",
    sortable: true,
  },
  {
    name: "Member Name",
    selector: (row: any) => row.Name || "-",
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) => row.mobileno || "-",
    sortable: true,
  },
  {
    name: "Loan Amount",
    selector: (row: any) => row.ew_credit || "-",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status || "-",
    sortable: true,
    cell: (row: any) => (
      <span className={`status-badge ${row.status?.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
  {
    name: "Action",
    cell: (row: any) => (
      <div className="action-buttons">
        <Button 
          variant="contained" 
          color="success"
          size="small"
          onClick={() => processLoan(row.member_id, 'approve')}
          style={{ marginRight: '8px' }}
        >
          Approve
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          size="small"
          onClick={() => processLoan(row.member_id, 'reject')}
        >
          Reject
        </Button>
      </div>
    ),
    sortable: false,
  },
];

// Columns for Withdraw Pending table (Admin)
// Hard-coded columns and styling to match dashboard tables
export const getWithdrawPendingColumns = (onRepay: (transaction: any) => void) => [
  {
    name: 'Date',
    selector: (row: any) => getFormattedDate(row.transaction_date) || '-',
    sortable: true,
  },
  {
    name: 'Member',
    selector: (row: any) => row.member_id || '-',
    sortable: true,
  },
  {
    name: 'Mobile No.',
    selector: (row: any) => row.memberDetails?.mobileno || '-',
    sortable: true,
  },
  {
    name: 'Account No.',
    selector: (row: any) => row.memberDetails?.account_number || '-',
    sortable: true,
  },
  {
    name: 'IFSC',
    selector: (row: any) => row.memberDetails?.ifsc_code || '-',
    sortable: true,
  },
  {
    name: 'Paid Amount',
    selector: (row: any) => row.ew_debit || '-',
    sortable: true,
    cell: (row: any) => row.ew_debit ? `₹${Number(row.net_amount).toLocaleString()}` : '-',
  },
  {
    name: 'Deducted',
    selector: (row: any) => row.deduction || 0,
    sortable: true,
    cell: (row: any) => `₹${Number(row.deduction || 0).toLocaleString()}`,
  },
  {
    name: 'Status',
    selector: (row: any) => row.status || '-',
    sortable: true,
  },
  {
    name: 'Action',
    cell: (row: any) => (
      <div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ textTransform: 'capitalize' }}
          onClick={() => onRepay(row)}
        >
          pay online
        </Button>
      </div>
    ),
    sortable: false,
  },
  //  {
  //   name: 'Action',
  //   cell: (row: any) => (
  //     <div>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         size="small"
  //         sx={{ textTransform: 'capitalize' }}
  //         onClick={() => onRepay(row)}
  //       >
  //         pay online
  //       </Button>
  //     </div>
  //   ),
  //   sortable: false,
  // },
];

export const getProcessedLoansColumns = () => [
  {
    name: "Date",
    selector: (row: any) => getFormattedDate(row.transaction_date) || "-",
    sortable: true,
  },
  {
    name: "Member ID",
    selector: (row: any) => row.member_id || "-",
    sortable: true,
  },
  {
    name: "Member Name",
    selector: (row: any) => row.Name || "-",
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) => row.mobileno || "-",
    sortable: true,
  },
  {
    name: "Loan Amount",
    selector: (row: any) => `₹${parseInt(row.ew_credit || 0).toLocaleString()}` || "-",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row: any) => row.status || "-",
    sortable: true,
    cell: (row: any) => (
      <span className={`status-badge ${row.status?.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
];

export const getLoansListColumns = (onRepayClick: (row: any) => void) => [
  {
    name: "Date",
    selector: (row: any) => {
      if (!row.transaction_date) return "-";
      const date = new Date(row.transaction_date);
      return date.toLocaleDateString("en-IN");
    },
    sortable: true,
  },
  {
    name: "Member ID",
    selector: (row: any) => row.member_id || "-",
    sortable: true,
  },
  {
    name: "Name",
    selector: (row: any) => row.Name || "-",
    sortable: true,
  },
  {
    name: "Mobile No.",
    selector: (row: any) => row.mobileno || "-",
    sortable: true,
  },
  {
    name: "Loan Amount",
    selector: (row: any) =>
      `₹${(row.ew_credit || 5000).toLocaleString("en-IN")}`,
    sortable: true,
  },
  {
    name: "Due Amount",
    selector: (row: any) =>
      `₹${row.net_amount?.toLocaleString("en-IN")}` || "-",
    sortable: true,
  },
  {
    name: "Action",
    cell: (row: any) => (
      <button
        onClick={() => onRepayClick(row)}
        style={{
          background: "#2c8786",
          color: "white",
          padding: "5px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Repay
      </button>
    ),
  },
];
