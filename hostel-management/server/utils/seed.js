const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Room = require('../models/Room');
const Tenant = require('../models/Tenant');
const RentRecord = require('../models/RentRecord');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear all collections
  await Promise.all([User, Room, Tenant, RentRecord, Complaint, Notice].map(M => M.deleteMany()));
  console.log('Cleared existing data');

  // Admin
  const admin = await User.create({ name: 'Admin User', email: 'admin@hostel.com', password: 'admin123', role: 'admin' });

  // Rooms
  const roomsData = [
    { roomNumber: '101', type: 'single', isAC: false, floor: 1, monthlyRent: 5000 },
    { roomNumber: '102', type: 'single', isAC: true,  floor: 1, monthlyRent: 6000 },
    { roomNumber: '103', type: 'double', isAC: false, floor: 1, monthlyRent: 4000 },
    { roomNumber: '201', type: 'double', isAC: true,  floor: 2, monthlyRent: 7000 },
    { roomNumber: '202', type: 'single', isAC: false, floor: 2, monthlyRent: 5000 },
    { roomNumber: '203', type: 'single', isAC: true,  floor: 2, monthlyRent: 6500 },
    { roomNumber: '301', type: 'double', isAC: true,  floor: 3, monthlyRent: 8000 },
    { roomNumber: '302', type: 'single', isAC: false, floor: 3, monthlyRent: 5000 },
  ];
  const rooms = await Room.insertMany(roomsData);

  // Tenants (creates users too)
  const tenantProfiles = [
    { name: 'Ravi Kumar',    email: 'ravi@example.com',    phone: '9876543210', address: 'Pune, MH',     room: rooms[0] },
    { name: 'Priya Sharma',  email: 'priya@example.com',   phone: '9876543211', address: 'Mumbai, MH',   room: rooms[1] },
    { name: 'Aarav Mehta',   email: 'aarav@example.com',   phone: '9876543212', address: 'Nashik, MH',   room: rooms[2] },
    { name: 'Sneha Patil',   email: 'sneha@example.com',   phone: '9876543213', address: 'Nagpur, MH',   room: rooms[3] },
    { name: 'Karan Singh',   email: 'karan@example.com',   phone: '9876543214', address: 'Delhi, DL',    room: rooms[4] },
  ];

  const tenants = [];
  for (const tp of tenantProfiles) {
    const user = await User.create({ name: tp.name, email: tp.email, password: 'tenant@123', role: 'tenant' });
    const tenant = await Tenant.create({ user: user._id, room: tp.room._id, phone: tp.phone, address: tp.address, emergencyContact: '9000000000' });
    tp.room.status = 'occupied';
    tp.room.currentTenant = tenant._id;
    await tp.room.save();
    tenants.push(tenant);
  }

  // Rent records (current month for all)
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const allActive = await Tenant.find({ isActive: true }).populate('room', 'monthlyRent');
  for (const t of allActive) {
    await RentRecord.create({ tenant: t._id, month, year, amount: t.room.monthlyRent, status: Math.random() > 0.5 ? 'paid' : 'unpaid', paidOn: Math.random() > 0.5 ? new Date() : null });
  }
  // Previous month records
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  for (const t of allActive) {
    await RentRecord.create({ tenant: t._id, month: prevMonth, year: prevYear, amount: t.room.monthlyRent, status: 'paid', paidOn: new Date() });
  }

  // Complaints
  await Complaint.insertMany([
    { tenant: tenants[0]._id, title: 'Water leakage in bathroom', description: 'There is a continuous drip from the overhead pipe since last 3 days.', status: 'open' },
    { tenant: tenants[1]._id, title: 'AC not working', description: 'Air conditioner stopped cooling last night. Room is very hot.', status: 'in_progress' },
    { tenant: tenants[2]._id, title: 'Broken window latch', description: 'The window latch on the east side is broken and cannot be locked.', status: 'resolved' },
    { tenant: tenants[3]._id, title: 'Noisy neighbors', description: 'Room next door plays loud music past midnight on weekdays.', status: 'open' },
    { tenant: tenants[4]._id, title: 'Wi-Fi not working', description: 'Internet connection has been unstable for the past week.', status: 'in_progress' },
  ]);

  // Notices
  await Notice.insertMany([
    { title: 'Water supply maintenance', message: 'Water supply will be interrupted on Sunday from 10am to 2pm for maintenance. Please store water in advance.', postedBy: admin._id },
    { title: 'Rent due reminder', message: 'All tenants are reminded that rent for this month is due by the 5th. Late payments will attract a penalty.', postedBy: admin._id },
    { title: 'Guest policy update', message: 'Guests are only allowed in common areas between 9am and 8pm. No overnight stays permitted.', postedBy: admin._id },
  ]);

  console.log('\n✅ Seed completed!');
  console.log('Admin login  → admin@hostel.com / admin123');
  console.log('Tenant login → ravi@example.com / tenant@123');
  console.log('             → priya@example.com / tenant@123');
  console.log('             → aarav@example.com / tenant@123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
