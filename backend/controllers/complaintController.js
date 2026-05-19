const Complaint = require('../models/Complaint');

// Add Complaint
exports.addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location, aiAnalysis } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Validation error: Missing title field' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const complaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
      aiAnalysis
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint stored successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Complaints (with optional category filter)
exports.getAllComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Complaint Status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search Complaint by Location
exports.searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location query parameter is required' });
    }

    // Case-insensitive search using regex
    const complaints = await Complaint.find({ location: new RegExp(location, 'i') });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
