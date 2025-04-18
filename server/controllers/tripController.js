const { TripData } = require('../models/TripData');

const tripController = {
  createTrip: async (req, res) => {
    try {
      // Check if the user already has a trip
      const existingTrip = await TripData.findOne({ userId: req.userId });
      if (existingTrip) {
        return res.status(400).json({
          success: false,
          message: 'You already have a trip. Delete your current trip to create a new one.',
        });
      }

      const trip = new TripData({ ...req.body, userId: req.userId });
      await trip.save();
      res.status(201).json({ success: true, trip });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error creating trip' });
    }
  },

  getTrips: async (req, res) => {
    try {
      const trips = await TripData.find({ userId: req.userId });
      res.json(trips);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting trips' });
    }
  },

  getTrip: async (req, res) => {
    try {
      const trip = await TripData.findOne({ _id: req.params.id, userId: req.userId });
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found or unauthorized' });
      }
      res.json(trip);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting trip' });
    }
  },

  updateTrip: async (req, res) => {
    try {
      const trip = await TripData.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found or unauthorized' });
      }
      res.json(trip);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating trip' });
    }
  },

  deleteTrip: async (req, res) => {
    try {
      const trip = await TripData.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found or unauthorized' });
      }
      res.json({ success: true, message: 'Trip deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting trip' });
    }
  },
};

module.exports = tripController;