import { Card, CardContent, Grid, Typography, Box, Container } from '@mui/material';
import { useGetAllMembersDetails } from '../../../api/Admin';
import { useGetTransactionDetails } from '../../../api/Memeber';
import DashboardTable from '../../Dashboard/DashboardTable';
import DashboardCard from '../../../components/common/DashboardCard';
import { getAdminDashboardTableColumns } from '../../../utils/DataTableColumnsProvider';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';

const AdminDashboard = () => { 
  const { data: members = [], isLoading: membersLoading, error: membersError } = useGetAllMembersDetails();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetTransactionDetails("all");
  const transactions = transactionsData?.data || [];
  
  // Calculate total Daily Incentive distributed
  const totalDailyIncentive = transactions
    .filter((tx: any) => 
      (tx.transaction_type?.toLowerCase() === "daily incentive" || 
       tx.description?.toLowerCase() === "daily incentive" ||
       tx.description?.toLowerCase().includes("daily incentive")) &&
      tx.status === "Completed"
    )
    .reduce((acc: number, tx: any) => acc + (parseFloat(tx.ew_credit) || 0), 0);

  // Sort members by most recent registration date
  const sortedMembers = [...members].sort((a, b) => {
    return new Date(b.createdAt || b.Date_of_joining).getTime() - 
           new Date(a.createdAt || a.Date_of_joining).getTime();
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((member: any) => 
  member.status?.toLowerCase() === 'active'
).length;

const pendingMembers = members.filter((member: any) => 
  member.status?.toLowerCase() === 'pending'
).length;

  const totalCities = new Set(members.map((member: any) =>  member.location).filter(Boolean)).size;
  const totalDegrees = new Set(members.map((member: any) => member.degree || member.education).filter(Boolean)).size;
  const totalEvents = 0;
  const totalLikes = 0; 

  if (membersLoading || transactionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Typography variant="h6">Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (membersError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Typography color="error">
          Error loading dashboard data: {(membersError as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ padding: 0 }}>
      {/* Dashboard Header */}
      <Box 
        sx={{
          width: '100%',
          mt: 9,
          mb: 3,
          py: { xs: 3, md: 4 },
          background: 'linear-gradient(135deg, #1b5e20 0%, #2c8786 50%, #004d40 100%)',
          borderRadius: { xs: 0, md: '0 0 16px 16px' },
          boxShadow: '0 6px 20px rgba(44, 135, 134, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background shapes */}
        <Box sx={{
          position: 'absolute', top: '-50%', left: '-10%', width: '40%', height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(30deg)', pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-50%', right: '-5%', width: '30%', height: '150%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(-20deg)', pointerEvents: 'none'
        }} />

        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1400px',
            px: { xs: 3, md: 6 },
            position: 'relative',
            zIndex: 2,
            gap: { xs: 3, md: 2 }
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1.5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.5rem', md: '2rem' },
                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              Welcome to Admin Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 0.5, 
                color: 'rgba(255,255,255,0.85)', 
                fontWeight: 400,
                fontSize: { xs: '0.875rem', md: '1rem' } 
              }}
            >
              Manage your network, track earnings, and oversee growth.
            </Typography>
          </Box>

          <Box 
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'space-between',
              gap: { xs: 0.5, sm: 1, md: 2 },
              color: 'white',
              flex: 1,
              width: '100%'
            }}
          >
            {[
              { label: 'Likes', value: `${totalLikes}k`, icon: <ThumbUpIcon sx={{ fontSize: { xs: 12, md: 16 } }} /> },
              { label: 'Degrees', value: totalDegrees, icon: <SchoolIcon sx={{ fontSize: { xs: 12, md: 16 } }} /> },
              { label: 'Events', value: totalEvents, icon: <EventIcon sx={{ fontSize: { xs: 12, md: 16 } }} /> },
              { label: 'Cities', value: totalCities, icon: <LocationOnIcon sx={{ fontSize: { xs: 12, md: 16 } }} /> }
            ].map((stat, idx) => (
              <Box 
                key={idx}
                sx={{ 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: { xs: '8px', md: '12px' },
                  padding: { xs: '6px 2px', sm: '10px 8px', md: '10px 16px' },
                  minWidth: { xs: '60px', sm: '75px', md: '90px' },
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, background 0.3s ease',
                  flex: { xs: 1, md: 'none' }, 
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, 
                    fontWeight: 'bold', 
                    mb: 0.2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  {stat.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, opacity: 0.9 }}>
                  {stat.icon}
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' }, fontWeight: 500, letterSpacing: '0.5px' }}>{stat.label}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* Dashboard Cards */}
      <Grid 
        container 
        spacing={{ xs: 2, sm: 3 }} 
        sx={{ 
          mx: { xs: 1, sm: 2 }, 
          my: 2,
          pt: 5,
          pr: 7,
          width: 'auto',
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard 
            amount={totalMembers} 
            title="Total Members" 
            subTitle={`${totalMembers} members in total`} 
            IconComponent={PersonIcon} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard 
            amount={activeMembers} 
            title="Active Members" 
            subTitle={`${activeMembers} active members`} 
            IconComponent={PersonIcon} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard 
            amount={pendingMembers} 
            title="Pending Members" 
            subTitle={`${pendingMembers} pending activation`} 
            IconComponent={PersonIcon} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard 
            amount={totalDailyIncentive} 
            title="Total Daily Incentive" 
            subTitle={`₹${totalDailyIncentive.toFixed(2)} distributed`} 
            IconComponent={PersonIcon} 
          />
        </Grid>
      </Grid>
      
      {/* Member Statistics Table */}
      <Box sx={{ mt: 10, p: 4, borderRadius: 1, boxShadow: 2 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c8786' }}>
                Member Statistics ({sortedMembers.length} members)
              </Typography>
            </Box>
            <DashboardTable 
              data={sortedMembers} 
              columns={getAdminDashboardTableColumns()} 
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default AdminDashboard;