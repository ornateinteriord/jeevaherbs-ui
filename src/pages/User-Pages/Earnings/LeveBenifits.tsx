import DataTable from 'react-data-table-component';
import { Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DASHBOARD_CUTSOM_STYLE, getLevelBenifitsColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetTransactionDetails } from '../../../api/Memeber';

const LevelBenifits = () => {
  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
  } = useGetTransactionDetails();

  // Ensure transactions is always an array
  const transactions = Array.isArray(transactionsData?.data) 
    ? transactionsData.data 
    : Array.isArray(transactionsData) 
      ? transactionsData 
      : [];

  const levelBenefitsData = transactions
    .filter((transaction: any) => {
      if (!transaction || typeof transaction !== 'object') return false;
      
      const matchesLevel = 
        transaction.benefit_type?.toLowerCase()?.includes('level') ||
        transaction.transaction_type?.toLowerCase()?.includes('level') ||
        transaction.transaction_type?.toLowerCase()?.includes('commission') ||
        transaction.transaction_type?.toLowerCase()?.includes('payout') ||
        transaction.transaction_type?.toLowerCase()?.includes('benefit') ||
        (transaction.level !== null && transaction.level !== undefined);

      return matchesLevel; 
    })
    .map((transaction: any) => ({
      id: transaction._id || transaction.transaction_id,
      date: transaction.transaction_date,
      payoutLevel: transaction.level ?? 'N/A',
      members: transaction.related_member_id || 'N/A',
      amount: transaction.ew_credit || '0',
      description: transaction.description,
      transactionType: transaction.transaction_type
    }));


  const noDataComponent = (
    <div style={{ padding: '24px' }}>
     No level benefits data available
    </div>
  );

  if (isError) {
    return (
      <Card sx={{ margin: '2rem', mt: 10 }}>
        <CardContent>
          <div style={{ padding: '24px', textAlign: 'center', color: 'red' }}>
            Error loading level benefits data: {error?.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ margin: '2rem', mt: 10 }}>
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
            List of Level Benefits ({levelBenefitsData.length})
          </AccordionSummary>
          <AccordionDetails>
            <DataTable
              columns={getLevelBenifitsColumns()}
              data={levelBenefitsData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              noDataComponent={noDataComponent}
              highlightOnHover
              progressPending={isLoading}
              subHeader
              subHeaderComponent={
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0.5rem' }}>
                  <TextField
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                  />
                </div>
              }
            />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LevelBenifits;