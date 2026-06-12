import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton, Avatar, Menu,
  MenuItem, Divider, Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard',  icon: <DashboardIcon />,     path: '/admin/dashboard' },
  { label: 'Rooms',      icon: <MeetingRoomIcon />,   path: '/admin/rooms' },
  { label: 'Tenants',    icon: <PeopleIcon />,        path: '/admin/tenants' },
  { label: 'Rent',       icon: <PaymentIcon />,       path: '/admin/rent' },
  { label: 'Complaints', icon: <ReportProblemIcon />, path: '/admin/complaints' },
  { label: 'Notices',    icon: <CampaignIcon />,      path: '/admin/notices' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, flexGrow: 1 }}>
            🏠 HostelMS
          </Typography>
          <Tooltip title={user?.name}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0F172A', color: 'white', border: 'none' },
      }}>
        <Toolbar />
        <Box sx={{ mt: 1, px: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748B', px: 2, fontWeight: 600, letterSpacing: 1 }}>
            ADMIN PANEL
          </Typography>
          <List dense sx={{ mt: 1 }}>
            {navItems.map(({ label, icon, path }) => {
              const active = location.pathname === path;
              return (
                <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton onClick={() => navigate(path)} sx={{
                    borderRadius: 2, mx: 1,
                    bgcolor: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                  }}>
                    <ListItemIcon sx={{ color: active ? '#60A5FA' : '#94A3B8', minWidth: 36 }}>{icon}</ListItemIcon>
                    <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#F1F5F9' : '#94A3B8' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: `${DRAWER_WIDTH}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
