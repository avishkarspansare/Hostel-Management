import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
<<<<<<< HEAD
  Box, AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Tabs, Tab, Container, ListItemIcon,
  useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton,
  ListItemText,
} from '@mui/material';
import DashboardIcon    from '@mui/icons-material/Dashboard';
import MeetingRoomIcon  from '@mui/icons-material/MeetingRoom';
import PeopleIcon       from '@mui/icons-material/People';
import PaymentIcon      from '@mui/icons-material/Payment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CampaignIcon     from '@mui/icons-material/Campaign';
import LogoutIcon       from '@mui/icons-material/Logout';
import MenuIcon         from '@mui/icons-material/Menu';
import useAuth from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard',  icon: <DashboardIcon fontSize="small" />,     path: '/admin/dashboard' },
  { label: 'Rooms',      icon: <MeetingRoomIcon fontSize="small" />,   path: '/admin/rooms' },
  { label: 'Tenants',    icon: <PeopleIcon fontSize="small" />,        path: '/admin/tenants' },
  { label: 'Rent',       icon: <PaymentIcon fontSize="small" />,       path: '/admin/rent' },
  { label: 'Complaints', icon: <ReportProblemIcon fontSize="small" />, path: '/admin/complaints' },
  { label: 'Notices',    icon: <CampaignIcon fontSize="small" />,      path: '/admin/notices' },
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
<<<<<<< HEAD
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl,   setAnchorEl]   = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeIdx = navItems.findIndex(n => location.pathname === n.path);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* ── Top bar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', zIndex: theme.zIndex.drawer + 1 }}
      >
        {/* Row 1: brand + avatar */}
        <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton edge="start" sx={{ mr: 1, color: 'primary.main' }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, flexGrow: 1, letterSpacing: -0.3 }}>
            🏠 HostelMS
          </Typography>

          {/* Avatar / profile menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mr: 0.5 }}>
                {user?.name}
              </Typography>
            )}
            <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        {/* Row 2: nav tabs — desktop only */}
        {!isMobile && (
          <Box sx={{ borderTop: '1px solid #F1F5F9', px: 2 }}>
            <Tabs
              value={activeIdx === -1 ? false : activeIdx}
              onChange={(_, i) => navigate(navItems[i].path)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 44,
                '& .MuiTab-root': {
                  minHeight: 44,
                  fontSize: 13,
                  fontWeight: 500,
                  textTransform: 'none',
                  color: '#64748B',
                  gap: 0.75,
                  px: 2,
                  '&.Mui-selected': { color: 'primary.main', fontWeight: 700 },
                },
              }}
            >
              {navItems.map(({ label, icon }) => (
                <Tab key={label} label={label} icon={icon} iconPosition="start" />
              ))}
            </Tabs>
          </Box>
        )}
      </AppBar>

      {/* ── Mobile drawer ── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 240, bgcolor: '#0F172A', color: 'white' } }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>🏠 HostelMS</Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>Admin Panel</Typography>
        </Box>
        <List dense sx={{ px: 1, pt: 1 }}>
          {navItems.map(({ label, icon, path }) => {
            const active = location.pathname === path;
            return (
              <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { navigate(path); setDrawerOpen(false); }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? 'rgba(37,99,235,0.2)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ color: active ? '#60A5FA' : '#94A3B8', display: 'flex' }}>{icon}</Box>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#F1F5F9' : '#94A3B8' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* ── Main content — centred ── */}
      <Box
        component="main"
        sx={{
          pt: isMobile ? '56px' : '100px',   // 56px bar + 44px tabs
          pb: 5,
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Outlet />
        </Container>
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
      </Box>
    </Box>
  );
};

export default AdminLayout;
