const RentRecord = require('../models/RentRecord');
const Tenant = require('../models/Tenant');

const populate = [{ path: 'tenant', populate: [{ path: 'user', select: 'name email' }, { path: 'room', select: 'roomNumber' }] }];

// Admin: get all rent records
const getAllRent = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.year) filter.year = Number(req.query.year);
    const records = await RentRecord.find(filter).populate(populate).sort({ year: -1, month: -1 });
    res.json(records);
  } catch (err) { next(err); }
};

// Admin: create rent records for all active tenants for a month
const createRentRecords = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) return res.status(400).json({ message: 'Month and year required' });

    const activeTenants = await Tenant.find({ isActive: true }).populate('room', 'monthlyRent');
    if (!activeTenants.length) return res.status(400).json({ message: 'No active tenants found' });

    const records = await Promise.allSettled(activeTenants.map(t =>
      RentRecord.create({ tenant: t._id, month, year, amount: t.room.monthlyRent })
    ));

    const created = records.filter(r => r.status === 'fulfilled').length;
    const skipped = records.filter(r => r.status === 'rejected').length;
    res.status(201).json({ message: `Created ${created} records, skipped ${skipped} duplicates` });
  } catch (err) { next(err); }
};

<<<<<<< HEAD
// Admin: create a single rent record for one specific tenant
const createSingleRentRecord = async (req, res, next) => {
  try {
    const { tenantId, month, year, amount } = req.body;
    if (!tenantId || !month || !year || !amount) {
      return res.status(400).json({ message: 'tenantId, month, year and amount are required' });
    }

    const tenant = await Tenant.findById(tenantId).populate('room', 'monthlyRent');
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    if (!tenant.isActive) return res.status(400).json({ message: 'Tenant is not active' });

    const record = await RentRecord.create({
      tenant: tenantId,
      month: Number(month),
      year: Number(year),
      amount: Number(amount),
    });

    const populated = await RentRecord.findById(record._id).populate(populate);
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A rent record already exists for this tenant, month and year' });
    }
    next(err);
  }
};

=======
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
// Admin: mark rent as paid
const markAsPaid = async (req, res, next) => {
  try {
    const record = await RentRecord.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidOn: new Date() },
      { new: true }
    ).populate(populate);
    if (!record) return res.status(404).json({ message: 'Rent record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

// Admin: mark rent as unpaid
const markAsUnpaid = async (req, res, next) => {
  try {
    const record = await RentRecord.findByIdAndUpdate(
      req.params.id,
      { status: 'unpaid', paidOn: null },
      { new: true }
    ).populate(populate);
    if (!record) return res.status(404).json({ message: 'Rent record not found' });
    res.json(record);
  } catch (err) { next(err); }
};

// Tenant: own rent history
const getMyRent = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    const records = await RentRecord.find({ tenant: tenant._id }).sort({ year: -1, month: -1 });
    res.json(records);
  } catch (err) { next(err); }
};

// Dashboard summary
const getRentSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const paid = await RentRecord.countDocuments({ month, year, status: 'paid' });
    const unpaid = await RentRecord.countDocuments({ month, year, status: 'unpaid' });
    const totalDue = await RentRecord.aggregate([
      { $match: { month, year, status: 'unpaid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ month, year, paid, unpaid, totalDue: totalDue[0]?.total || 0 });
  } catch (err) { next(err); }
};

<<<<<<< HEAD
module.exports = { getAllRent, createRentRecords, createSingleRentRecord, markAsPaid, markAsUnpaid, getMyRent, getRentSummary };
=======
module.exports = { getAllRent, createRentRecords, markAsPaid, markAsUnpaid, getMyRent, getRentSummary };
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
