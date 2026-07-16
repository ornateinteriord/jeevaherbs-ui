import { Card, CardContent, Grid, Typography, Box, Container } from '@mui/material';
import { useGetAllMembersDetails } from '../../../api/Admin';
import DashboardTable from '../../Dashboard/DashboardTable';
import DashboardCard from '../../../components/common/DashboardCard';
import { getAdminDashboardTableColumns } from '../../../utils/DataTableColumnsProvider';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';

const AdminDashboard = () => { 
  const { data: members = [], isLoading, error } = useGetAllMembersDetails();

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Typography variant="h6">Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
        <Typography color="error">
          Error loading dashboard data: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ padding: 0 }}>
      {/* Dashboard Header */}
      <Box 
        sx={{
          height: { xs: 'auto', md: '40' },
          width: '100%',
          overflow: 'hidden',
          bgcolor: '#2c8786',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 10,
          py: { xs: 6, md: 0 }
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            bgcolor: '#2c8786',
            zIndex: 20,
            pointerEvents: 'none',
            maskImage: 'radial-gradient(transparent,white)'
          }} 
        />
        
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            px: { xs: 4, md: 8 },
            position: 'relative',
            zIndex: 20,
            gap: { xs: 6, md: 0 }
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white',
                fontSize: { xs: '1.5rem', md: '2.5rem' }
              }}
            >
              Welcome to Admin Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2, 
                color: 'neutral.300', 
                fontSize: { xs: '0.875rem', md: '1rem' } 
              }}
            >
              Manage your network and track your success
            </Typography>
          </Box>

          <Box 
            sx={{
              display: { xs: 'grid', md: 'flex' },
              gridTemplateColumns: 'repeat(2, 1fr)',
              alignItems: 'center',
              gap: { xs: 6, md: 12 },
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  fontWeight: 'bold', 
                  mb: 2 
                }}
              >
                {totalLikes}k
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <ThumbUpIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                <Typography variant="caption">Great</Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  fontWeight: 'bold', 
                  mb: 2 
                }}
              >
                {totalDegrees}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SchoolIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                <Typography variant="caption">Degrees</Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  fontWeight: 'bold', 
                  mb: 2 
                }}
              >
                {totalEvents}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <EventIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                <Typography variant="caption">Events</Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, 
                  fontWeight: 'bold', 
                  mb: 2 
                }}
              >
                {totalCities}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                <Typography variant="caption">Cities</Typography>
              </Box>
            </Box>
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