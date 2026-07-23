import DataTable from 'react-data-table-component';
import { Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField, Typography, Button, Grid, CircularProgress,  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DASHBOARD_CUTSOM_STYLE, getMembersColumns, getPendingMembersColumns } from '../../../utils/DataTableColumnsProvider';
import './Members.scss'
import { MuiDatePicker } from '../../../components/common/DateFilterComponent';
import {  useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetAllMembersDetails, useUpdateMemberStatus, useLoginAsMemberMutation } from '../../../api/Admin';
import { useNavigate } from 'react-router-dom';
import useSearch from '../../../hooks/SearchQuery';

interface MemberTableProps {
  title: string;
  summaryTitle: string;
  data: any[];
  showEdit?: boolean;
  showActivate?: boolean;
  showDashboardLogin?: boolean;
  onDashboardLogin?: (memberId: string) => void;
  isLoading?: boolean;
  onActivate?: (memberId: string) => void;
  isActivating?: boolean;
}

const MemberTable = ({ 
  title, 
  summaryTitle, 
  data, 
  showEdit = false, 
  showActivate = false, 
  showDashboardLogin = false,
  onDashboardLogin,
  isLoading = false,
  onActivate,
  isActivating = false 
}: MemberTableProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const { searchQuery, setSearchQuery, filteredData } = useSearch(data)

  const navigate = useNavigate()

  const handleEditClick = (memberId: string) => {
    setIsEdit(true);
    setSelectedMemberId(memberId); 
  };

  const handleActivateClick = (memberId: string) => {
    if (onActivate) {
      onActivate(memberId);
    }
  };

  useEffect(() => {
    if(isEdit){
      navigate(`/admin/members/${selectedMemberId}`)
    }
  }, [isEdit])

  // Determine which columns to use based on props
  const getColumns = () => {
    if (showActivate && onActivate) {
      return getPendingMembersColumns(handleActivateClick, isActivating);
    } else {
      return getMembersColumns(showEdit, handleEditClick, showDashboardLogin, onDashboardLogin);
    }
  };

  return (
    <>
      <Grid className="filter-container" sx={{ margin: '2rem', mt: 12 }}>
        <Typography variant="h4">
          {title}
        </Typography>
        <Grid className="filter-actions" >
          <MuiDatePicker date={fromDate} setDate={setFromDate} label="From Date" />
          <MuiDatePicker date={toDate} setDate={setToDate} label="To Date" />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2c8786',
              '&:hover': { backgroundColor: '#2c8786' }
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ margin: '2rem', mt: 2 }}>
        <CardContent>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#2c8786',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              {summaryTitle}
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DataTable
                columns={getColumns()}
                data={filteredData}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                progressPending={isLoading}
                progressComponent={
                  <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }} />
                }
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

interface Member {
  Member_id: string;
  Date_of_joining: string;
  password: string;
  Sponsor_name: number | string; 
  spackage: number | string;
  mobileno: number | string;
  status: string;
  Name: string;
}

type status = "All" | "active" | "Inactive" | "Pending";

const useMembers = (status: status) => {
  const { data: members, isLoading, isError, error  } = useGetAllMembersDetails()

  useEffect(() => {
    if (isError) {
      const err = error as any;
      toast.error(
        err?.response.data.message || "Failed to fetch Transaction details"
      );
    }
  }, [isError, error]);

  const memberdata = Array.isArray(members)
    ? members.filter((member: Member) => (status === "All" ? true : member.status === status)).map((member: Member, index) => ({
        ...member,
        sNo: index + 1,
      }))
    : [];
    
  return { memberdata, isLoading };
};

export const Members = () => {
  const { memberdata, isLoading } = useMembers("All"); 
  const { mutate: loginAsMember } = useLoginAsMemberMutation();
  return (
    <MemberTable
      title="Members"
      summaryTitle="List of All Members"
      showEdit
      showDashboardLogin={true}
      onDashboardLogin={(memberId) => loginAsMember(memberId)}
      data={memberdata}
      isLoading={isLoading}
    />
  );
};

export const ActiveMembers = () => {
  const { memberdata, isLoading } = useMembers("active")
  const { mutate: loginAsMember } = useLoginAsMemberMutation();
  return (
    <MemberTable
      title="Active Members"
      summaryTitle="List of Active Members"
      showDashboardLogin={true}
      onDashboardLogin={(memberId) => loginAsMember(memberId)}
      data={memberdata}
      isLoading={isLoading}
    />
  )
}

export const InActiveMembers = () => {
  const { memberdata, isLoading } = useMembers("Inactive")
  const { mutate: loginAsMember } = useLoginAsMemberMutation();
  return (
    <MemberTable
      title="Inactive Members"
      summaryTitle="List of Inactive Members"
      showDashboardLogin={true}
      onDashboardLogin={(memberId) => loginAsMember(memberId)}
      data={memberdata}
      isLoading={isLoading}
    />
  )
}

export const PendingMembers = () => {
  const { memberdata, isLoading } = useMembers("Pending");
  const { mutate: updateMemberStatus, isPending: isActivating } = useUpdateMemberStatus();

  const handleActivateClick = (memberId: string) => {
    updateMemberStatus(
      { memberId, status: 'active' },
      {
        onSuccess: () => {
          toast.success('Member activated successfully!');
        },
        onError: () => {
          toast.error('Failed to activate member.');
        }
      }
    );
  };

  return (
    <MemberTable
      title="Pending Members"
      summaryTitle="List of Pending Members"
      data={memberdata}
      showActivate={true}
      isLoading={isLoading}
      onActivate={handleActivateClick}
      isActivating={isActivating}
    />
  );
};

export default Members;