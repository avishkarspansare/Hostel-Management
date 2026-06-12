const Notice = require('../models/Notice');

const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) { next(err); }
};

const createNotice = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message required' });
    const notice = await Notice.create({ title, message, postedBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) { next(err); }
};

const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) { next(err); }
};

module.exports = { getNotices, createNotice, deleteNotice };
