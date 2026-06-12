const Complaint = require('../models/Complaint');
const Tenant = require('../models/Tenant');

const populate = [{ path: 'tenant', populate: { path: 'user', select: 'name email' } }];

const getAllComplaints = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const complaints = await Complaint.find(filter).populate(populate).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { next(err); }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['open', 'in_progress', 'resolved'].includes(status))
      return res.status(400).json({ message: 'Invalid status value' });
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(populate);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) { next(err); }
};

const raiseComplaint = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });
    const complaint = await Complaint.create({ tenant: tenant._id, title, description });
    res.status(201).json(complaint);
  } catch (err) { next(err); }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id });
    if (!tenant) return res.status(404).json({ message: 'Tenant profile not found' });
    const complaints = await Complaint.find({ tenant: tenant._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { next(err); }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllComplaints, updateComplaintStatus, raiseComplaint, getMyComplaints, deleteComplaint };
