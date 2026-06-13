import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu,
<<<<<<< HEAD
  MenuItem, Divider, BottomNavigation, BottomNavigationAction, Paper, ListItemIcon,
} from '@mui/material';
import MeetingRoomIcon    from '@mui/icons-material/MeetingRoom';
import PaymentIcon        from '@mui/icons-material/Payment';
import ReportProblemIcon  from '@mui/icons-material/ReportProblem';
import CampaignIcon       from '@mui/icons-material/Campaign';
import LogoutIcon         from '@mui/icons-material/Logout';
import PersonIcon         from '@mui/icons-material/Person';
=======
  MenuItem, Divider, BottomNavigation, BottomNavigationAction, Paper,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
import useAuth from '../hooks/useAuth';

const navItems = [
  { label: 'My Room',    icon: <MeetingRoomIcon />,   path: '/tenant/room' },
  { label: 'Rent',       icon: <PaymentIcon />,       path: '/tenant/rent' },
  { label: 'Complaints', icon: <ReportProblemIcon />, path: '/tenant/complaints' },
  { label: 'Notices',    icon: <CampaignIcon />,      path: '/tenant/notices' },
];

const TenantLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const currentIndex = navItems.findIndex(n => location.pathname === n.path);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, flexGrow: 1 }}>
            🏠 HostelMS
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider />
<<<<<<< HEAD
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/tenant/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
=======
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8, mb: 7 }}>
        <Outlet />
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={currentIndex} onChange={(_, v) => navigate(navItems[v].path)} showLabels>
          {navItems.map(({ label, icon }) => (
            <BottomNavigationAction key={label} label={label} icon={icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default TenantLayout;
